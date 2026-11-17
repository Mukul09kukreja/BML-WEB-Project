// Market: server logic and supporting functions.
// Connect market URLs to their request handlers.
module.exports = function (app, market) {
  const handlers = require('../controllers/market')(market);
  app.get('/api/health', handlers.getHealth);
  app.get('/api/quotes', handlers.getQuotes);
  app.get('/api/market/stream', handlers.streamQuotes);

};
