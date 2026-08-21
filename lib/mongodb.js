import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

export async function getDb() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI in your environment variables (.env.local)');
  }
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    global._mongoClient = cachedClient;
  }
  await cachedClient.connect();
  cachedDb = cachedClient.db(dbName);
  global._mongoDb = cachedDb;
  return cachedDb;
}
