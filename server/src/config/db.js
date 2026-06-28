import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI nao configurado.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
  });
  console.log("MongoDB conectado");
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}
