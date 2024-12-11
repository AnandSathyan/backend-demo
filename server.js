const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');  // Correct import
const os = require('os');
// Set up Express app and HTTP server

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serial Port configuration
const portName = os.platform() === 'win32' ? 'COM3' : '/dev/ttyUSB0';  // Windows: COM3, Linux/macOS: /dev/ttyUSB0
const serialPort = new SerialPort({
  path: portName,
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// When a new connection is made to the web server (client-side)
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send a welcome message to the client
  socket.emit('message', 'Connected to scanner stream');
  
  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Serial port event - when data is received from the scanner
serialPort.on('data', (data) => {
  const scannedCode = data.toString().trim();  // Convert the buffer to a string
  console.log('Scanned code:', scannedCode);
  
  // Emit the scanned code to all connected clients
  io.emit('scannedCode', scannedCode);
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
