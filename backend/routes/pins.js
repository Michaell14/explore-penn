const express = require('express');
const router = express.Router();

const { db } = require('../firebase.js'); // Import the Firestore instance
const { collection, addDoc } = require('firebase/firestore'); // Import Firestore methods

const postsRef = collection(db, "posts");

// Add pin
router.post('/add', async (req, res) => {
    // Extract parameters from the request body
    const { description, u_id, coordinate } = req.body;

    if (!description || !u_id || !coordinate || !coordinate.lat || !coordinate.lng) {
        return res.status(400).send("Missing required fields: description, u_id, or coordinates.");
    }

    try {
        await addDoc(postsRef, { // Directly use postsRef
            description,
            u_id,
            coordinate: [lat, lng]
        });
        res.status(200).send("Document successfully added");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Error adding document");
    }
});

module.exports = router;
