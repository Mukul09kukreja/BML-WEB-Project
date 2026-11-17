// Limit repeated authentication attempts by IP address.
module.exports = function (app) {
  const attempts = new Map();
  const cleanup = setInterval(() => {
    for (const [ip, attempt] of attempts) if (attempt.until < Date.now()) attempts.delete(ip);
  }, 60000);
  cleanup.unref();
  app.use(['/api/signup', '/api/signin'], (req, res, next) => {
    if (req.method !== 'POST') return next();
    const attempt = attempts.get(req.ip);
    const current = attempt && attempt.until > Date.now() ? attempt : { count: 0, until: Date.now() + 60000 };
    attempts.set(req.ip, current);
    if (++current.count > 10) return res.set('Retry-After', String(Math.ceil((current.until - Date.now()) / 1000))).status(429).json({ error: 'Too many attempts. Try again in a minute.' });
    next();
  });

};
