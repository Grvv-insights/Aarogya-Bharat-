import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  AarogyaBharat Medical Tourism Backend API Ready!`);
    console.log(`  Server running on http://localhost:${PORT}`);
    console.log(`  Health check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();
