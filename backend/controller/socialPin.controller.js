import {db} from "../server.js"
import admin from 'firebase-admin';


/** for location notifs - pins within a radius
 * @route POST /pins/location
 * @body { latitude: number, longitude: number, radius: number }
 */
export const getPinsByLocation = async (req, res) => {
    const { latitude, longitude, radius } = req.body;
    try {
      const socialPinRef = db.collection("socialPins");
      const snapshot = await socialPinRef.get();
      const pinsWithinRadius = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((pin) => calculateDistance(pin, latitude, longitude) <= radius);
      res.status(200).json(pinsWithinRadius);
    } catch (error) {
      console.error("Error fetching pins by location:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

/**
 * Calculate the Euclidean distance between a pin and a given location.
 */
const calculateDistance = (pin, latitude, longitude) => {
    const xDist2 = Math.pow(pin.coords.lat - latitude, 2);
    const yDist2 = Math.pow(pin.coords.lng - longitude, 2);
    return Math.sqrt(xDist2 + yDist2);
  };

export const getPin = async (req, res) => {
    const { pin_id } = req.params;
    try {
        const socialPinRef = db.collection('socialPins')
        const pinDoc = await socialPinRef.doc(pin_id).get();

        if (!pinDoc.exists) {
            return res.status(404).json({ message: "Pin not found." });
        }

        const pinData = pinDoc.data();

        const userRef = db.collection('users').doc(pinData.u_id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = userDoc.data();

        const response = {
            pin: {
                ...pinData,
                pin_id: pin_id,
            },
            user: {
                name: userData.name,
                email: userData.email,
            },
        };
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching pin details:", error);
        res.status(500).json({ error: "Failed to fetch pin details" });
    }
};

export const addPin = async (req, res) => {
    const { description, loc_description, u_id, coordinate, photo } = req.body;

    if (!description || !u_id || !coordinate || !coordinate.lat || !coordinate.lng) {
        return res.status(400).json({ error: "Missing required field" });
    }

    try {
        const socialPinRef = db.collection('socialPins')
        const newPost = {
            description,
            u_id,
            coords: {
                lat: coordinate.lat,
                lng: coordinate.lng,
            },
            time_posted: admin.firestore.FieldValue.serverTimestamp(),
            //optional?
            loc_description,
            photo
        };

        const postRef = await socialPinRef.add(newPost);

        res.status(200).json({ message: "Post successfully added", postId: postRef.id });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: "Failed to add post" });
    }
};