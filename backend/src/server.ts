import 'dotenv/config';
import { connectDB } from './config/db';
import app from './app';

const PORT = process.env.PORT ?? 4000;

async function start(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
