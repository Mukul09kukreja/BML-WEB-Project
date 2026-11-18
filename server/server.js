
// Connect to MongoDB, start the HTTP server, and handle shutdown.
require('dotenv').config({ quiet: true });

const crypto = require('node:crypto');
const mongoose = require('mongoose');
const Market = require('./services/market');
const { createApp } = require('./app');

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from .env');
  }

  const production = process.env.NODE_ENV === 'production';

  const secret =
    process.env.SESSION_SECRET ||
    (production ? '' : crypto.randomBytes(32).toString('hex'));

  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters.');
  }

  // MongoDB connection
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME?.trim() || undefined,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      family: 4
    });

    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code || 'Unknown');
    console.error('Name:', error.name);

    if (error.cause) {
      console.error('Cause:', error.cause);
    }

    throw error;
  }

  const market = new Market();
  market.start();

  await mongoose.connection.collection('sessions').createIndex(
    { expires: 1 },
    { expireAfterSeconds: 0 }
  );

  const streams = new Set();

  market.on('stream:open', response => {
    streams.add(response);
    response.on('close', () => streams.delete(response));
  });

  const app = createApp({ market, secret, production });
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port, () => {
    console.log(`StockPie running at http://localhost:${port}`);
  });

  let stopping = false;

  const stop = async () => {
    if (stopping) return;
    stopping = true;

    console.log('Shutting down StockPie...');

    market.stop();

    const drained = new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });

    for (const response of streams) {
      response.end();
    }

    try {
      await drained;
      await mongoose.disconnect();
      console.log('StockPie stopped successfully.');
      process.exit(0);
    } catch (error) {
      console.error('Shutdown failed:', error.message);
      process.exit(1);
    }
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

start().catch(error => {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
});
