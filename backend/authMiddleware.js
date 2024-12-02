import admin from './firebaseadmin.js';
import express from 'express';
const router = express.Router();

const authenticateJWT = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = decodedToken; // Attach the user info to the request object
            next();
        } catch (error) {
            console.error("Invalid token:", error);
            return res.status(403).send("Unauthorized access."); // Forbidden
        }
    } else {
        return res.status(401).send("No token provided."); // Unauthorized
    }
};

export default authenticateJWT;
