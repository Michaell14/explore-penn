const express = require('express');
const router = express.Router();

const { db } = require('../firebase.js'); // Import the Firestore instance
const { collection, addDoc } = require('firebase/firestore'); // Import Firestore methods

const locationsRef = collection(db, "locations");

//add pin
router.post('/add', async (req, res) => {
    try {
        await addDoc(locationsRef, {
            name: "Ben on the Bench",
            coords: [39.9523572654358, -75.1969358301247],
            address: "1234 Market St, Philadelphia, PA 19107",
            hours: {
                "Monday": "08:30-21:00",
                "Tuesday": "08:30-21:00",
                "Wednesday": "08:30-21:00",
                "Thursday": "08:30-21:00",
                "Friday": "08:30-21:00",
                "Saturday": "08:30-21:00",
                "Sunday": "08:30-21:00"
            },
            facts: [
                "This bench is a great place to sit and relax",
                "It's a great place to people watch",
                "It's a great place to read a book"
            ]
        });
        res.status(200).send("Document successfully added");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Error adding document");
    }
});

module.exports = router;