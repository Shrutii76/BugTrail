import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  await mongoose.connect(mongoUri);

  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}
