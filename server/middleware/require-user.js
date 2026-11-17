// Load the account before allowing access to portfolio routes.
const User = require('../models/user');

module.exports = function (app) {
  app.use('/api', async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Sign in to view your portfolio.' });
    req.user = await User.findById(req.session.userId);
    if (!req.user) return res.status(401).json({ error: 'Sign in again.' });
    next();
  });

};
