import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  await mongoose.connect(uri, {
    maxPoolSize: 10, // reuse connections across requests; do not open a new connection per request
  });

  isConnected = true;
  console.log('✅ MongoDB connected');
}
