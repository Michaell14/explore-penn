import {db} from "../server.js"
import admin from 'firebase-admin';


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
    const pinsRef = db.collection('posts');
    const snapshot = await pinsRef.get();
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