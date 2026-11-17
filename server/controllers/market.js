// Serve cached quotes, connection status, and browser quote streams.
const mongoose = require('mongoose');

// Existing market request handlers. Each function receives an Express request and response.
module.exports = function (market) {
  return {
    // Report database connectivity and market-feed status.
    getHealth: (req, res) => res.json({ database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', market: market.status }),
    // Return the cached stock quotes without fetching them again.
    getQuotes: (req, res) => res.json(market.payload()),
    // Keep the browser connected and send quote updates as they arrive.
    streamQuotes: (req, res) => {
      market.emit('stream:open', res);
      res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.flushHeaders();
      const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 20000);
      const send = data => res.write(`data: ${JSON.stringify(data)}\n\n`);
      send(market.payload());
      market.on('update', send);
      req.on('close', () => { clearInterval(heartbeat); market.off('update', send); });
    }
  };
};
