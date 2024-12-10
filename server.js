// const express = require('express');
// const sql = require('mssql/msnodesqlv8')
// const { connect } = require('./db/mongoConnect');
// const { ObjectId } = require('mongodb');
// const cors = require('cors');
// const app = express();

// // Enable CORS for all origins
// app.use(cors());
// app.use(express.json());  
// // const config = {
// //     // user: "sa",
// //     // password: "Peg@123",
// //     server: "DESKTOP-JTOOILO\PRADEEP",
// //     database: "BACKEND_TEST",
// //     driver:"msnodesqlv8",
// //     options: {
// //         // trustServerCertificate: true,
// //         trustedConnection: true,
// //         // enableArithAbort: true,
// //         instancename: "PRADEEP"
// //     },
   
// // }
// // sql.connect(config)
// //   .then(() => {
// //     console.log('Connected to SQL Server');
// //     // Execute queries here
// //   })
// //   .catch(err => {
// //     console.error('SQL Connection Error:', err);
// //   });
  
// // API endpoint to add a new document
// // POST route to add a document
// app.post('/add', async (req, res) => {
//   console.log('Request Body:', req.body);  // Log the body to check what you are receiving
//   try {
//     const db = await connect(); // Ensure the connection is established
//     const collection = db.collection('emp'); // Replace with your collection name

//     // Destructure the data from the request body
//     const { name, Age } = req.body;

//     // Check if 'name' and 'Age' are present
//     if (!name || !Age) {
//       return res.status(400).json({ error: 'Name and Age are required.' });
//     }

//     // Insert the new document into the collection
//     const result = await collection.insertOne({ name, Age });
//     res.status(201).json({
//       message: 'Document added successfully',
//       insertedId: result.insertedId,  // Returns the inserted document's ID
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to add document', details: error.message });
//   }
// });


// // API endpoint to get all documents
// app.get('/get', async (req, res) => {
//   try {
//     const db = await connect();
//     const collection = db.collection('emp');
//     const documents = await collection.find({}).toArray();
//     res.status(200).json(documents);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch documents', details: error.message });
//   }
// });

// // API endpoint to edit a document
// app.put('/edit/:id', async (req, res) => {
//   try {
//     const db = await connect();
//     const collection = db.collection('emp');
//     const { id } = req.params;  // Get the document ID from the URL
//     const { name, age } = req.body;

//     const result = await collection.updateOne(
//       { _id: new ObjectId(id) },  // ObjectId is required to query by the document's ID
//       { $set: { name, age } }
//     );

//     if (result.modifiedCount > 0) {
//       res.status(200).json({ message: 'Document updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Document not found or no change made' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update document', details: error.message });
//   }
// });

// // API endpoint to delete a document
// app.delete('/delete/:id', async (req, res) => {
//   try {
//     const db = await connect();
//     const collection = db.collection('emp');
//     const { id } = req.params;  // Get the document ID from the URL
//     // console.log("ididid",id)
//     // const data = await db.listCollections().toArray();
//     // console.log("result",data)
//     const result = await collection.deleteOne({ _id: new ObjectId(id) })
//     if (result.deletedCount > 0) {
//       res.status(200).json({ message: 'Document deleted successfully' });
//     } else {
//       res.status(404).json({ error: 'Document not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete document', details: error.message });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {  
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const WebSocket = require('ws');
const SerialPort = require('serialport');

const app = express();
const port = 8000; // Vercel backend usually uses standard port configurations

// Setup WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send a message when a client connects
  ws.send('Connected to WebSocket');
  
  // Setup SerialPort for scanner reading
  const serialPort = new SerialPort('/dev/ttyS0', { baudRate: 9600 }); // Update the port as needed for your setup

  // Read barcode data from the scanner
  serialPort.on('data', (data) => {
    const barcode = data.toString('utf-8').trim();
    console.log('Scanned Barcode:', barcode);
    
    // Send the barcode to the connected frontend via WebSocket
    ws.send(barcode);
  });

  serialPort.on('error', (err) => {
    console.error('Error in serial port:', err);
  });
});

// Handle HTTP server to upgrade connections for WebSocket
app.server = app.listen(port, () => {
  console.log(`Backend server running on https://backend-demo-git-main-anands-projects-d712ebf9.vercel.app/`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
