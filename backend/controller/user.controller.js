import {db} from "../server.js"
import admin from 'firebase-admin';


export const createUser = async(req, res) => {
    const { uid, name, email } = req.body;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    

    if (!doc.exists) {
        const newUser = {
          uid,
          name,
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        
        try{
            if (!uid || !name || !email) {
              return res.status(400).json({ error: 'Missing required fields: uid, name, and email' });
            }
            await userRef.set(newUser);
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (e){
            console.error('Error creating user:', e);
            res.status(500).json({ e: 'Failed to create user' });
        }
        
      } else {
        console.error("User already exists");
        res.status(200).json({ message: 'User already exists' });
      }
}

// getting my posts
export const getMyPosts = async (req, res) => {
  const { u_id } = req.params;

  if (!u_id) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {

      const userRef = db.collection('users').where('uid', '==', u_id);
      const doc = await userRef.get();

      if (doc.empty) {
        return res.status(404).json({ message: "No user found. "});
      }
      
      // fetch all posts by the specified user_id
      const postsRef = db.collection('posts').where('u_id', '==', u_id);
      const postsSnapshot = await postsRef.get();

      if (postsSnapshot.empty) {
          return res.status(404).json({ message: "No posts found for this user." });
      }

      // process each post and fetch reactions with usernames using helper
      const postsWithReactions = await Promise.all(
          postsSnapshot.docs.map(async (postDoc) => {
              const post = postDoc.data();
              post.post_id = postDoc.id; // Include post ID

              // fetch reactions for this post with usernames
              const reactionsWithNames = await fetchReactionsWithUserNames(post.post_id);

              // combine post data with its reactions
              return {
                  ...post,
                  reactions: reactionsWithNames,
              };
          })
      );

      // Send the response
      res.status(200).json({ posts: postsWithReactions });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Failed to fetch user posts" });
    }
};

/*
getting the top 10 posts
*/
export const getTopPins = async (req, res) => {
  const { u_id } = req.params;

  if (!u_id) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {

      const userRef = db.collection('users').where('uid', '==', u_id);
      const doc = await userRef.get();

      if (doc.empty) {
        return res.status(404).json({ message: "No user found. "});
      }

      const postsRef = db.collection('posts').where('u_id', '==', u_id);
      const postsSnapshot = await postsRef.get();

      if (postsSnapshot.empty) {
          return res.status(404).json({ message: "No posts found for this user." });
      }

      const pins = postsSnapshot.docs.map(doc => ({
          ...doc.data(),
          post_id: doc.id
      }));

      // count reactions for each pin
      const pinReactionCounts = await Promise.all(
          pins.map(async (pin) => {
              const reactionsRef = db.collection('reactions').where('post_id', '==', pin.post_id);
              const reactionsSnapshot = await reactionsRef.get();
              return {
                  ...pin,
                  reactionCount: reactionsSnapshot.size, // count reactions for this pin
              };
          })
      );

      // sort pins by reaction count in descending order and get the top 10
      const topPosts = pinReactionCounts
          .sort((a, b) => b.reactionCount - a.reactionCount)
          .slice(0, 10);

      res.status(200).json({ topPosts });
  } catch (error) {
      console.error("Error fetching top posts:", error);
      res.status(500).json({ error: "Failed to fetch top posts" });
  }
};


export const getReactedPosts = async (req, res) => {
  const { u_id } = req.params;

  if (!u_id) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {
      const userRef = db.collection('users').where('uid', '==', u_id);
      const doc = await userRef.get();

      if (doc.empty) {
        return res.status(404).json({ message: "No user found. "});
      }

      // fetch all reactions by the specified user
      const reactionsRef = db.collection('reactions').where('u_id', '==', u_id);
      const reactionsSnapshot = await reactionsRef.get();

      if (reactionsSnapshot.empty) {
          return res.status(404).json({ message: "No reactions found for this user." });
      }

      // Step 2: Process each reaction and fetch the corresponding post
      const postsWithReactions = await Promise.all(
          reactionsSnapshot.docs.map(async (reactionDoc) => {
              const reaction = reactionDoc.data();
              const postId = reaction.post_id;

              // Fetch post data for this post_id
              const postRef = db.collection('posts').doc(postId);
              const postDoc = await postRef.get();

              if (!postDoc.exists) {
                  return null; // Skip if post doesn't exist
              }

              const post = postDoc.data();
              post.post_id = postDoc.id; // Include post ID

              const reactionsWithNames = await fetchReactionsWithUserNames(post.post_id);

              // Combine post data with this user's reaction type
              return {
                  ...post,
                  userReaction: reaction.type,
                  reactions: reactionsWithNames,
              };
          })
      );

      // Filter out any null entries (in case of missing posts)
      const filteredPosts = postsWithReactions.filter(post => post !== null);

      // Send the response
      res.status(200).json({ posts: filteredPosts });
  } catch (error) {
      console.error("Error fetching reacted posts:", error);
      res.status(500).json({ error: "Failed to fetch reacted posts" });
  }
};






/*****
helper functions
*****/

const fetchReactionsWithUserNames = async (pin_id) => {
  // fetch reactions associated with this pin_id
  const reactionsRef = db.collection('reactions').where('post_id', '==', pin_id);
  const reactionsSnapshot = await reactionsRef.get();

  const reactions = reactionsSnapshot.docs.map(doc => doc.data());
  const reactionUserIds = reactions.map(reaction => reaction.u_id);

  // fetch user data for each unique u_id in reactions
  const userPromises = reactionUserIds.map(async (u_id) => {
      const userSnapshot = await db.collection('users').doc(u_id).get();
      return { u_id, name: userSnapshot.exists ? userSnapshot.data().name : "Unknown User" };
  });

  const reactionUsers = await Promise.all(userPromises);

  // combine reactions with user names
  return reactions.map(reaction => {
      const user = reactionUsers.find(u => u.u_id === reaction.u_id);
      return {
          type: reaction.type,
          u_id: reaction.u_id,
          name: user ? user.name : "Unknown User",
      };
  });
};
