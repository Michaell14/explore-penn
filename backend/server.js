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
});

const port = 3001;

server.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);

});