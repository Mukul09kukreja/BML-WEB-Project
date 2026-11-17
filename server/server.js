// Connect to MongoDB, start the HTTP server, and drain requests during shutdown.
require('dotenv').config({ quiet: true });
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const Market = require('./services/market');
const { createApp } = require('./app');

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env to connect MongoDB.');
  const production = process.env.NODE_ENV === 'production';
  const secret = process.env.SESSION_SECRET || (production ? '' : crypto.randomBytes(32).toString('hex'));
  if (secret.length < 32) throw new Error('Set SESSION_SECRET to at least 32 characters.');

  await mongoose.connect(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME ? { dbName: process.env.MONGODB_DB_NAME } : {});

  const market = new Market();
  market.start();
  await mongoose.connection.collection('sessions').createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
  const streams = new Set();
  market.on('stream:open', response => {
    streams.add(response);
    response.on('close', () => streams.delete(response));
  });
  const app = createApp({ market, secret, production });
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => console.log(`StockPie running at http://localhost:${port}`));

  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    market.stop();
    // Close long-lived quote streams, then let ordinary requests finish using MongoDB.
    const drained = new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
    for (const response of streams) response.end();
    try {
      await drained;
      await mongoose.disconnect();
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
