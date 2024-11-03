import {db} from "../server.js"
import admin from 'firebase-admin';


export const getLocation = async (req, res) => {
    const { location_id } = req.params;

    if (!location_id) {
        return res.status(400).json({ error: "Location ID is required." });
    }

    try {
        // Fetch the location document from Firestore
        const locationRef = db.collection('locations').doc(location_id);
        const locationDoc = await locationRef.get();

        if (!locationDoc.exists) {
            return res.status(404).json({ message: "Location not found." });
        }

        // Retrieve the location data
        const locationData = locationDoc.data();

        // Send the location data as a response
        res.status(200).json({ location: locationData });
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: "Failed to fetch location." });
    }
};