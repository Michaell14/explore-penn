import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import routes from './routes/index.js';
import { startPeriodicUpdates } from './utils/openingTimeUpdates.js';
import { startPinUpdates } from './utils/currentPinUpdates.js';
import { startPeriodicNotifications } from './controller/notif.controller.js';

// Resolve paths for service account files
const serviceAccountPath = path.resolve('./firebaseServiceAccount.json');
const notifServiceAccountPath = path.resolve('./firebaseNotifServiceAccount.json');

export const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf-8')
);
export const notifServiceAccount = JSON.parse(
  fs.readFileSync(notifServiceAccountPath, 'utf-8')
);

// Initialize Firebase Admin SDK
// try {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
//   console.log('Firebase Admin initialized successfully.');
// } catch (error) {
//   console.error('Error initializing Firebase Admin:', error);
//   process.exit(1);
// }

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

startPeriodicUpdates();
startPinUpdates();
startPeriodicNotifications();

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Test route to verify Firestore connection
app.get('/test-db', async (req, res) => {
  try {
    const testDoc = await db.collection('testCollection').doc('testDoc').get();
    res.json(testDoc.exists ? testDoc.data() : { message: 'No data found.' });
  } catch (error) {
    res.status(500).json({ error: 'Error accessing Firestore', details: error.message });
  }
});
app.get('/test-notification', async (req, res) => {
  const testDeviceToken = 'i4HcI7mwErLjuJuiR-Wbv:APA91bHgvZDNzYFa8IvpwQSoMAkcfqTiWfKh5fMBUzLtj4awJWkYVm-xlDK0XI5DZo_bTFf0yi2XpqQSuxrNnDu23WFB1dFqB_vhhqr7dPa6zOWkTcmOhwI';
  const testPins = [
    { id: '1', coords: [39.9530, -75.1907], header: 'Hill House', loc_description: 'Test location' },
  ];

  try {
    const response = await admin.messaging().send({
      token: testDeviceToken,
      notification: {
        title: 'Test Notification',
        body: 'This is a test notification',
      },
      data: {
        pins: JSON.stringify(testPins),
      },
    });

    console.log('Test Notification Response:', response);
    res.status(200).json({ success: true, message: 'Test notification sent successfully.' });
  } catch (error) {
    console.error('Error sending test notification:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


export { db, app };
