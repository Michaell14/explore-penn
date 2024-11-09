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


