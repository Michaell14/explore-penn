import {db} from "../server.js"
import admin from 'firebase-admin';


export const createUser = async(req, res) => {

    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Missing required fields: name and email' });
    }
    

    try {
        const userQuery = db.collection('users').where('email', '==', email);
        const userSnapshot = await userQuery.get();

        if (!userSnapshot.empty) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const newUser = {
            name,
            email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const userRef = await db.collection('users').add(newUser);
        res.status(201).json({ message: 'User created successfully', userId: userRef.id, user: newUser });

    } catch (e){
        console.error('Error creating org:', e);
        res.status(500).json({ e: 'Failed to create org' });
    }
}

// getting my posts
export const getMyPosts = async (req, res) => {
  const { u_id } = req.params;

  if (!u_id) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {

      const userRef = db.collection('users').doc(u_id);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: "No user found. "});
      }
      
      // fetch all posts by the specified user_id
      const postsRef = db.collection('socialPins').where('u_id', '==', u_id);
      const postsSnapshot = await postsRef.get();

      if (postsSnapshot.empty) {
          return res.status(404).json({ message: "No posts found for this user." });
      }

      const posts = postsSnapshot.docs.map(postDoc => ({
        ...postDoc.data(),
        post_id: postDoc.id,
      }));

      res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching org posts:", error);
        res.status(500).json({ error: "Failed to fetch org posts" });
    }
};

// note that there were reacted / top posts, but we don't have reactions, so they were discarded