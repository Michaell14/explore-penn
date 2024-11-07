import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import fs from 'fs'
import routes from './routes/index.js';

export const serviceAccount = JSON.parse(fs.readFileSync('./firebaseServiceAccount.json', 'utf-8'));
export const notifServiceAccount = JSON.parse(fs.readFileSync('./firebaseNotifServiceAccount.json', 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export {db, app}

