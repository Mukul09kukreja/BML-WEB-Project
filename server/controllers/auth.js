// Validate account credentials and manage signed-in sessions.
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const User = require('../models/user');

const fail = (message, status = 400) => Object.assign(new Error(message), { status });
const publicUser = user => ({ id: String(user._id), username: user.username });

// Existing auth request handlers. Each function receives an Express request and response.
module.exports = function () {
  return {
    // Return the current account and the token required for POST requests.
    getSession: (req, res) => {
      req.session.csrf ||= crypto.randomBytes(24).toString('hex');
      res.json({ user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null, csrf: req.session.csrf });
    },
    // Validate account details and store a password hash.
    signUp: async (req, res) => {
      const username = typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : '';
      const password = req.body?.password;
      const validUsername = /^[a-z0-9_]{3,24}$/.test(username);
      const validEmail = username.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
      if (!validUsername && !validEmail) throw fail('Enter a username or a valid email address.');
      if (typeof password !== 'string' || password.length < 8) throw fail('Password must be at least 8 characters.');
      if (Buffer.byteLength(password) > 72) throw fail('Password must be at most 72 UTF-8 bytes.');
      const passwordHash = await bcrypt.hash(password, 10);
      try { await User.create({ username, passwordHash }); }
      catch (error) { if (error.code === 11000) throw fail('That username is already taken.', 409); throw error; }
      res.status(201).json({ message: 'Account created. Sign in to continue.' });
    },
    // Check credentials and create a new signed-in session.
    signIn: async (req, res) => {
      const username = typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : '';
      const password = req.body?.password;
      if (typeof password !== 'string' || Buffer.byteLength(password) > 72) throw fail('Incorrect username or password.', 401);
      let user = await User.findOne({ username }).select('+passwordHash');
      if (!user && username.includes('@')) {
        const legacy = await User.collection.findOne({ email: username });
        if (legacy && typeof password === 'string' && await bcrypt.compare(password, legacy.passwordHash)) {
          await User.collection.updateOne({ _id: legacy._id }, { $set: { username } });
          user = await User.findById(legacy._id).select('+passwordHash');
        }
      }
      if (!user || typeof password !== 'string' || !await bcrypt.compare(password, user.passwordHash)) throw fail('Incorrect username or password.', 401);
      await new Promise((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
      req.session.userId = String(user._id);
      req.session.username = user.username;
      req.session.csrf = crypto.randomBytes(24).toString('hex');
      res.json({ message: 'Signed in.', user: publicUser(user), csrf: req.session.csrf });
    },
    // Remove the session and clear its browser cookie.
    signOut: (req, res) => req.session.destroy(error => {
      if (error) return res.status(500).json({ error: 'Could not sign out.' });
      res.clearCookie('stockpie.sid');
      res.json({ message: 'Signed out.' });
    })
  };
};
