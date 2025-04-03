const express = require('express');
const escpos = require('escpos');
escpos.Network = require('escpos-network'); // Network printer support
const sharp = require('sharp');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST',
    allowedHeaders: 'Content-Type',
}));

app.use(express.json());

// Function to load and process the logo
async function getProcessedLogo(logoPath) {
    try {
        const buffer = await sharp(logoPath)
            .resize(250, 100) // Resize image to fit receipt
            .grayscale() // Convert to grayscale
            .toBuffer();

        return buffer;
    } catch (error) {
        console.error('❌ Error processing logo:', error);
        return null;
    }
}

// API endpoint to print receipt with logo
app.post('/print-receipt', async (req, res) => {
    const { printerIP, message } = req.body;
    if (!printerIP || !message) {
        return res.status(400).json({ error: 'Printer IP and message are required' });
    }

    try {
        const device = new escpos.Network(printerIP, 9100); // Connect to network printer
        const printer = new escpos.Printer(device);

        device.open(async (err) => {
            if (err) {
                console.error("❌ Printer connection failed:", err);
                return res.status(500).json({ error: 'Printer connection failed' });
            }

            try {
                // Load and process the logo
                const logoPath = path.join(__dirname, 'image.jpg'); // Ensure the logo is in the same folder
                if (fs.existsSync(logoPath)) {
                    const logoBuffer = await getProcessedLogo(logoPath);
                    if (logoBuffer) {
                        printer.align('ct'); // Center align the logo
                        printer.image(logoBuffer);
                        printer.newLine();
                    }
                } else {
                    console.warn("⚠️ Logo file not found, printing without logo...");
                }

                // Print text
                printer.text("Pegasus Restaurant");
                printer.text("====================");
                printer.text(`Phone No: 1`);
                printer.text(`Invoice No: VKDGCV9WN`);
                printer.text(`Date: ${new Date().toISOString().split('T')[0]}`);
                printer.text("");
                printer.text(`Customer: CASH`);
                printer.text("");
                printer.text(`Item: Buffalo Chicken Wings`);
                printer.text(`Qty: 1    Price: 43.54`);
                printer.text("");
                printer.text(`Total: 43.54 KD`);
                printer.text("");
                printer.text("Thank you for shopping!");
                printer.newLine();
                printer.newLine();
                printer.cut(); // Cut the paper
                printer.close();

                console.log("🖨️ Receipt printed successfully");
                res.status(200).json({ message: "Receipt printed successfully" });

            } catch (imageError) {
                console.error("❌ Error processing logo:", imageError);
                res.status(500).json({ error: "Failed to process logo", details: imageError.message });
            }
        });

    } catch (error) {
        console.error('❌ Failed to print receipt:', error);
        res.status(500).json({ error: 'Failed to print receipt', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
