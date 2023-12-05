const { MongoClient } = require('mongodb');
const connectionString = "mongodb+srv://capstone_proj_user:yuUkHoBzB1oKhHjS@cluster0.jfypo3a.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);

module.exports = async function (data) {
  try {
    await client.connect();
    const database = await client.db('mydatabase');
    const coll = await database.collection('mybooks');
    return await coll.insertOne(data);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
