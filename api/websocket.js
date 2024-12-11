const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;  // Heroku will assign the port

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    console.log('Received barcode:', message);
  });

  ws.send('Connected to WebSocket server');
});

// Upgrade HTTP to WebSocket
app.server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
