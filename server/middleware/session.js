// Attach the persistent session after confirming database connectivity.
const mongoose = require('mongoose');

module.exports = function (app, sessions) {
  app.use('/api', (req, res, next) => {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'MongoDB is not connected. Set MONGODB_URI in .env.' });
    sessions(req, res, next);
  });

};
