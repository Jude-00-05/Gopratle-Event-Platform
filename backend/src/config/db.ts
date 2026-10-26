import mongoose from 'mongoose';

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        maxPoolSize: 10, // reuse connections across requests; do not open a new connection per request
      })
      .then(() => {
        isConnected = true;
        console.log('\u2705 MongoDB connected');
      })
      .catch((error: unknown) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}
