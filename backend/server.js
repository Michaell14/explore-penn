<<<<<<< HEAD
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import fs from 'fs'
import routes from './routes/index.js';
import { startPeriodicUpdates } from './utils/openingTimeUpdates.js';

export const serviceAccount = JSON.parse(fs.readFileSync('./firebaseServiceAccount.json', 'utf-8'));
export const notifServiceAccount = JSON.parse(fs.readFileSync('./firebaseNotifServiceAccount.json', 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
=======
const http = require('http');
const admin = require('./firebaseadmin');
const functions = require('firebase-functions');

const testFirestoreRead = async () => {
    const db = admin.firestore();
    const testDocRef = db.collection('test').doc('sampleDoc'); // Replace with an actual test collection/doc if available
  
    try {
      const doc = await testDocRef.get();
      if (doc.exists) {
        console.log('Test document data:', doc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error reading test document:', error);
    }
  };

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello, Node.js HTTP Server!</h1>');
    res.end();

    testFirestoreRead();
>>>>>>> origin/frontend-branch
});

const db = admin.firestore();

<<<<<<< HEAD
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes); 

startPeriodicUpdates();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export {db, app}
=======
server.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);

});
>>>>>>> origin/frontend-branch
