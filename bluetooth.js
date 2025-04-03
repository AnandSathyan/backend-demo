const escpos = require('escpos');
const SerialPort = require('serialport'); // Correct import

// Replace this with your Bluetooth serial port (e.g., /dev/rfcomm0 or COM4)
const bluetoothPort = '/dev/rfcomm0';  // For Linux/macOS
// const bluetoothPort = 'COM4';  // For Windows (replace with your actual COM port)

const port = new SerialPort(bluetoothPort, {
  baudRate: 9600,  // Adjust baud rate according to your printer settings
  dataBits: 8,
  parity: 'none',
  stopBits: 1
});

const printer = new escpos.Printer(port);

port.on('open', () => {
  console.log('Connected to Bluetooth printer');

  // Example of sending a print job
  printer
    .font('a')                  // Set font
    .align('ct')                // Center align
    .style('bu')                // Bold & Underline
    .size(1, 1)                 // Regular size
    .text('The quick brown fox jumps over the lazy dog')  // Text
    .barcode('1234567', 'EAN8') // Barcode example
    .table(["One", "Two", "Three"])  // Table example
    .cut()                       // Cut the paper
    .close();                    // Close the connection after printing

  console.log('Print job sent');
});

port.on('error', (err) => {
  console.error('Error with serial port:', err.message);
});
