import { app, analytics } from './firebaseconfig.js';
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello, Node.js HTTP Server!</h1>');
    res.end();
});

const port = 3001;

server.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});