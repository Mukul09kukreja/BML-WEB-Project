// Auth: server logic and supporting functions.
// Connect auth URLs to their request handlers.
module.exports = function (app) {
  const handlers = require('../controllers/auth')();
  app.get('/api/session', handlers.getSession);

  require('../middleware/rate-limit')(app);
  app.post('/api/signup', handlers.signUp);

  app.post('/api/signin', handlers.signIn);

  app.post('/api/signout', handlers.signOut);

};
