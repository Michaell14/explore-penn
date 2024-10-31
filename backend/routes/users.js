const express = require('express');
const router = express.Router();

const { db } = require('../firebase.js'); // Import the Firestore instance
const { collection, addDoc } = require('firebase/firestore'); // Import Firestore methods

const userssRef = collection(db, "users");

//add pin
router.post('/add', async (req, res) => {
    try {
        await addDoc(postsRef, { // Directly use postsRef
            description: "i need another coffee..... O.o",
            u_id: "random_u_id",
            coordinate: {
                lat: 39.9526,
                lng: -75.1652
            }
        });
        res.status(200).send("Document successfully added");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Error adding document");
    }
});

module.exports = router;