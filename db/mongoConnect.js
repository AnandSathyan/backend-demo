// const { MongoClient, ServerApiVersion } = require('mongodb');

// // Your connection URI
// const uri =  "mongodb+srv://anandsathyan005:pU26zZqhagBEcYu9@cluster0.pv29i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connect() {
//   try {
//     console.log('Attempting to connect...');
//     await client.connect();
//     console.log("Connected to MongoDB!");
//     db = client.db('Test_123'); 
//     return db;
//     // const database = client.db('Test_123');
//     // const collection = database.collection('emp'); // Collection name (will be created if it doesn't exist)
    
//     // // 1. Add a document
//     // const document = { name: "Demos", age: 27 }; // Example document
//     // const result = await collection.insertOne(document);
//     // console.log(`Document inserted with _id: ${result.insertedId}`);

//     //  // 2. Update a document (editing)
//     //  const updateFilter = { name: "Anand" };
//     //  const updateDoc = { $set: { age: 30 } }; // Changing age to 30
//     //  const updateResult = await collection.updateOne(updateFilter, updateDoc);
//     //  console.log(`Matched ${updateResult.matchedCount} document(s) and modified ${updateResult.modifiedCount} document(s)`);
 
//     //  // 3. Delete a document
//     //  const deleteResult = await collection.deleteOne({ name: "Demo" });
//     //  console.log(`Deleted ${deleteResult.deletedCount} document(s)`);

     
//     // const documents = await collection.find().toArray();
//     // console.log('Documents:', documents);  // Logs the documents in the collection

//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   } finally {
//     await client.close();
//   }
// }

// // run().catch(console.dir);
// module.exports = { connect };


const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://anandsathyan005:pU26zZqhagBEcYu9@cluster0.pv29i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

async function connect() {
  if (db) return db; // If the database is already connected, return it
  try {
    await client.connect();
    db = client.db('Test_123');  // Replace with your database name
    console.log("Successfully connected to the database");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;  // Rethrow the error to handle it in the route
  }
}

module.exports = { connect };

