const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

// Initialize Firebase Admin SDK using credentials from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  }),
});

// Initialize Firestore
const db = admin.firestore();

// Load the JSON data
const data = JSON.parse(fs.readFileSync('locations.json', 'utf8'));

// Function to delete all documents in the collection
async function deleteAllDocuments() {
  const collectionRef = db.collection('locations');
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log('No documents to delete.');
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log('All documents deleted from the collection.');
}

// Function to upload data to Firestore
async function uploadData() {
  const collectionRef = db.collection('locations');

  for (const location of data) {
    try {
      // Add document with a generated ID
      const docRef = await collectionRef.add(location);
      console.log(`Document ${docRef.id} added successfully`);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }
}

// Run the functions to delete existing documents and then upload new data
deleteAllDocuments().then(() => {
  uploadData().then(() => {
    console.log('All data uploaded');
    process.exit();
  });
});
