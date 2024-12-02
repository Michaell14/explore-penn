import {db} from "../server.js"
import admin from 'firebase-admin';


export const createOrg = async(req, res) => {
    const { name, username, password, description } = req.body;
    
    if (!name || !username || !password || !description) {
        return res.status(400).json({ error: 'Missing required fields: name, username, password, description' });
    }
    

    try {
        const orgQuery = db.collection('organizations').where('name', '==', name);
        const orgSnapshot = await orgQuery.get();

        if (!orgSnapshot.empty) {
            return res.status(409).json({ message: 'Organization with this name already exists' });
        }

        const newOrg = {
            name,
            username,
            password,
            description,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const orgRef = await db.collection('organizations').add(newOrg);
        res.status(201).json({ message: 'Org created successfully', orgId: orgRef.id, org: newOrg });

    } catch (e){
        console.error('Error creating org:', e);
        res.status(500).json({ e: 'Failed to create org' });
    }
}

// getting my posts
export const getOrgPosts = async (req, res) => {
  const { o_id } = req.params;

  if (!o_id) {
      return res.status(400).json({ message: "Org ID is required." });
  }

  try {

      const orgRef = db.collection('organizations').doc(o_id);
      const doc = await orgRef.get();

      if (doc.empty) {
        return res.status(404).json({ message: "No organization found. "});
      }
      
      // fetch all posts by the specified user_id
      const postsRef = db.collection('eventPins').where('org_id', '==', o_id);
      const postsSnapshot = await postsRef.get();

      if (postsSnapshot.empty) {
          return res.status(404).json({ message: "No posts found for this organization." });
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




/*****
helper functions
*****/

// const fetchReactionsWithUserNames = async (pin_id) => {
//   // fetch reactions associated with this pin_id
//   const reactionsRef = db.collection('reactions').where('post_id', '==', pin_id);
//   const reactionsSnapshot = await reactionsRef.get();

//   const reactions = reactionsSnapshot.docs.map(doc => doc.data());
//   const reactionUserIds = reactions.map(reaction => reaction.u_id);

//   // fetch user data for each unique u_id in reactions
//   const userPromises = reactionUserIds.map(async (u_id) => {
//       const userSnapshot = await db.collection('users').doc(u_id).get();
//       return { u_id, name: userSnapshot.exists ? userSnapshot.data().name : "Unknown User" };
//   });

//   const reactionUsers = await Promise.all(userPromises);

//   // combine reactions with user names
//   return reactions.map(reaction => {
//       const user = reactionUsers.find(u => u.u_id === reaction.u_id);
//       return {
//           type: reaction.type,
//           u_id: reaction.u_id,
//           name: user ? user.name : "Unknown User",
//       };
//   });
// };
