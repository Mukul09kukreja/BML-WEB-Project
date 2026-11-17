// Portfolio: server logic and supporting functions.
// Connect portfolio URLs to their request handlers.
module.exports = function (app, market) {
  const handlers = require('../controllers/portfolio')(market);
  app.get('/api/portfolio', handlers.getPortfolio);

  app.post('/api/portfolio/:side', handlers.placeTrade);

};
