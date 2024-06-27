import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'contactsDB';

let db;

async function connectToDatabase() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  console.log('Connected successfully to MongoDB');
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export { connectToDatabase, getDb };
