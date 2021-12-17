import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_KEY);

  return client;
}

export default connectToDatabase;
