const { SerialPort } = require('serialport');  // Use destructuring for newer versions
const { ReadlineParser } = require('@serialport/parser-readline');

// Replace with your actual serial port path
const portPath = 'COM3';  // For Windows, use the appropriate COM port like COM3

// Initialize the serial port connection to the barcode scanner
const port = new SerialPort({
  path: portPath,      // Specify the serial port path
  baudRate: 9600,      // Set the baud rate (typically 9600 for barcode scanners)
  dataBits: 8,         // 8 data bits, standard for most serial communication
  parity: 'none',      // No parity bit
  stopBits: 1,         // 1 stop bit
  flowControl: false   // No flow control
});

// Set up the parser to read data line by line, assuming newline or carriage return delimiters
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// When data is received from the scanner, it will be processed here
parser.on('data', function (data) {
  // Clean the data and remove any unwanted characters (e.g., carriage return, newline)
  const cleanedData = data.trim();
  
  // Print the received barcode data
  console.log('Received barcode data:', cleanedData);
});

// Handle any errors with the serial port
port.on('error', function (err) {
  console.error('Error with the serial port:', err.message);
});

// Optionally, you can listen for opening the port to ensure successful connection
port.on('open', function () {
  console.log('Serial port opened successfully. Waiting for data...');
});

// This will ensure that when the application exits, we clean up the port connection properly
process.on('SIGINT', () => {
  port.close(() => {
    console.log('Port closed, exiting...');
    process.exit();
  });
});
