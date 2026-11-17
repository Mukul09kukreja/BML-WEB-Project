// Assemble HTTP routes and middleware in the order requests must pass through them.
const express = require('express');
const session = require('express-session');
const MongoSessions = require('./storage/mongo-sessions');

function createApp({ market, secret, production = false, store = new MongoSessions() }) {
  const app = express();
  app.disable('x-powered-by');
  if (production) app.set('trust proxy', 1);
  app.use(express.json({ limit: '10kb' }));

  const sessions = session({
    name: 'stockpie.sid', secret, store, resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 7 * 86400000 }
  });

  require('./routers/market')(app, market);

  require('./middleware/session')(app, sessions);
  require('./middleware/csrf')(app);
  require('./routers/auth')(app);

  require('./middleware/require-user')(app);
  require('./routers/portfolio')(app, market);

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  require('./routers/pages')(app);

  require('./middleware/error-handler')(app);
  return app;
}

module.exports = { createApp };
