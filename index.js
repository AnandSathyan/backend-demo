const express = require('express');
const net = require('net');

const app = express();
const port = 5000;

// Printer IP and port
const printerIP = '192.168.3.81'; // Update with your printer's IP
const printerPort = 9100;         // Default port for Zebra printers (9100)

// Receipt content
const receiptContent = `
SOFT ROCK
سوق سوفت روك
Soft Rock Dajeej
Phone No.: 60480489

Inv No.: 1910018339
Date: 17/1/2019 9:50 PM
Customer Name: CASH
User ID: 1050 SAMEH
Mobile No.:
Order No.:

Items:
1. 10013557 - Toys
   Qty: 1 | Price: 0.250 | Total: 0.250
2. 10013557 - Balloon
   Qty: 1 | Price: 0.250 | Total: 0.250

Total Items: 3
Gross Amount: 2.500
Discount Amount: 0.000
Net Amount: 2.500

Payment Detail:
Paid By CASH KD: 2.500
Change KD: 0.000

EXCHANGE & REFUND POLICY
- Exchange and refund will happen only when the original receipt is submitted.
- Items purchased at regular prices can be refunded within 14 days or exchanged within 14 days.
- No Exchange/Refund on Undergarments.

Thank You For Shopping at Souk Soft Rock!
Hotline: +965 - 55355256
Facebook: facebook.com/softrockgcc
Instagram: instagram.com/softrockkw
`;

// Function to send the receipt to the printer
function printReceipt(content) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({ host: printerIP, port: printerPort }, () => {
            console.log('Connected to printer');
            client.write(content, (err) => {
                if (err) {
                    console.error('Error sending data to printer:', err);
                    reject(err);
                } else {
                    console.log('Receipt sent to printer');
                    resolve('Receipt sent to printer');
                }
                client.end();
            });
        });

        client.on('error', (err) => {
            console.error('Error connecting to the printer:', err);
            reject(err);
        });

        client.on('end', () => {
            console.log('Disconnected from printer');
        });
    });
}

// API endpoint to print receipt
app.post('/print-receipt', async (req, res) => {
    try {
        const result = await printReceipt(receiptContent);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to print receipt', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
