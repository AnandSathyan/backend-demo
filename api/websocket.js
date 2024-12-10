// /api/websocket.js (Vercel API Route)
import { WebSocketServer } from 'ws';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Initialize WebSocket server for the connection upgrade
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        console.log('Received message:', message);
      });

      // Send a message back to the client when a connection is established
      ws.send('Connected to WebSocket server');
    });

    // Upgrade the HTTP connection to WebSocket
    res.socket.server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    res.status(200).end(); // Send a 200 response back
  } else {
    res.status(405).end(); // Method Not Allowed for non-GET requests
  }
}
