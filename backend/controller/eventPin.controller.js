import {db} from "../server.js"
import admin from 'firebase-admin';

const eventPinRef = db.collection('eventPins')

export const getPinsByLocation = async(req, res) => {
    const { latitude, longitude, radius } = req.body;
    try {
        const pinsWithinRadius = await getNearbyPins(latitude, longitude, radius);
        res.status(200).json(pinsWithinRadius);
    } catch (error) {
        console.error("Error fetching pins by location:", error);
        res.status(500).send("Internal Server Error");
    }

}

export const getNearbyPins = async(latitude, longitude, radius) => {
    const snapshot = await eventPinRef.get();
    const pinsWithinRadius =snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(pin => calculateDistance(pin, latitude, longitude) <= radius);
    return pinsWithinRadius;
}

const calculateDistance = (pin, latitude, longitude) => {
    let xDist2 = ((pin.coordinate.lat) - latitude)
    xDist2 = xDist2 * xDist2
    let yDist2 = ((pin.coordinate.lng) - longitude)
    yDist2 = yDist2 * yDist2
    console.log(Math.sqrt(xDist2 + yDist2))
    return Math.sqrt(xDist2 + yDist2);
}

export const getPin = async (req, res) => {
    const { pin_id } = req.params;
    try {
        const pinDoc = await eventPinRef.doc(pin_id).get();

        if (!pinDoc.exists) {
            return res.status(404).json({ message: "Pin not found." });
        }

        const pinData = pinDoc.data();

        const orgRef = db.collection('organizations').doc(pinData.org_id);
        const orgDoc = await orgRef.get();

        if (!orgDoc.exists) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const orgData = orgDoc.data();

        const response = {
            pin: {
                ...pinData,
                pin_id: pin_id,
            },
            user: {
                name: orgData.name,
                email: orgData.email,
            },
        };
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching pin details:", error);
        res.status(500).json({ error: "Failed to fetch pin details" });
    }
};

export const addPin = async (req, res) => {
    const { description, loc_description, duration, org_id, coordinate, photo } = req.body;

    if (!description || !org_id || !duration || !coordinate || !coordinate.lat || !coordinate.lng) {
        return res.status(400).json({ error: "Missing required field" });
    }

    try {
        const newPost = {
            description,
            org_id,
            coords: [
                coordinate.lat,
                coordinate.lng
            ],
            duration,
            time_posted: admin.firestore.FieldValue.serverTimestamp(),
            //optional?
            loc_description,
            photo
        };

        const postRef = await eventPinRef.add(newPost);

        res.status(200).json({ message: "Post successfully added", postId: postRef.id });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: "Failed to add post" });
    }
};