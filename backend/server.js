require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require("firebase/firestore");
const admin = require("firebase-admin");
const cors = require('cors'); // Import CORS
const path = require('path'); // For handling file paths

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVcPQ18HbuIL6zFc7EMHVSWOwbHHU5U2E",
  authDomain: "explore-penn-f67e6.firebaseapp.com",
  projectId: "explore-penn-f67e6",
  storageBucket: "explore-penn-f67e6.appspot.com",
  messagingSenderId: "414478752713",
  appId: "1:414478752713:web:3a97d56840222b61efa618",
  measurementId: "G-DSJY5NEQ36"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "your_private_key_id", // You may want to get this from the downloaded JSON if needed
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \n with new line
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create an Express application
const server = express();
server.use(cors()); // Enable CORS
server.use(express.json()); // Middleware to parse JSON bodies

// Serve the HTML file
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust path if necessary
});

// Authentication middleware
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

// API endpoints
server.get('/locations', async (req, res) => {
    try {
        const snapshot = await getDocs(collection(db, "locations"));
        const pins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(pins); // Use Express response methods
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents.");
    }
});

server.post('/locations', authenticateJWT, async (req, res) => {
    const { name, coords, address, hours, facts } = req.body;

    if (!name || !coords || !address || !hours || !facts) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        await addDoc(collection(db, "locations"), {
            name,
            coords,
            address,
            hours,
            facts
        });
        res.status(200).send("Location document successfully added.");
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Error adding document.");
    }
});

// Start the server
const port = 3001;
server.listen(port, () => {
    console.log(`Node.js server is running on port ${port}`);
});
