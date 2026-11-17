// Reject state-changing requests without the session CSRF token.
module.exports = function (app) {
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && (!req.session.csrf || req.session.csrf !== req.get('X-CSRF-Token'))) {
      return res.status(403).json({ error: 'Refresh the page and try again.' });
    }
    next();
  });
};
