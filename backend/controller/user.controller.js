import {db} from "../server.js"
import admin from 'firebase-admin';


export const createUser = async (req, res) => {
    const { uid, email } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required fields: uid and email' });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return res.status(409).json({ message: 'User with this UID already exists' });
        }

        // Generate a random two-word username
        const adjectives = ['Hungry', 'Silly', 'Grumpy', 'Playful', 'Happy'];
        const animals = ['Hippo', 'Panda', 'Koala', 'Duck', 'Tiger'];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

        const username = `${randomAdjective} ${randomAnimal}`;

        const newUser = {
            username,
            email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            numPins: 0,
            numStickers: 0,
        };

        await userRef.set(newUser);
        res.status(201).json({
            message: 'User created successfully',
            uid,
            user: newUser,
        });
    } catch (e) {
        console.error('Error creating user:', e);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getUserById = async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user: { id: userDoc.id, ...userDoc.data() } });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};


export const deleteUserById = async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await userRef.delete();

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};


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