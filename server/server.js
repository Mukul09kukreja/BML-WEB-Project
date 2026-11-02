// Simple StockPie login system: Express + a local JSON file.
const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT = path.join(__dirname, '../client');
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json({ limit: '10kb' }));

// Read registered accounts. The file contains password HASHES, not passwords.
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Sign up: validate -> check duplicate -> hash password -> save to JSON.
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || email.length > 160 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof password !== 'string' || password.length < 8 || password.length > 200) {
      return res.status(400).json({ error: 'Enter a valid email and password (at least 8 characters).' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    if (users.some(user => user.email === cleanEmail)) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email: cleanEmail, password: hashedPassword });
    saveUsers(users);
    res.status(201).json({ message: 'Account created.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Sign in: find email -> compare entered password with stored hash.
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Enter email and password.' });
    }
    const user = getUsers().find(user => user.email === email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    res.json({ message: 'Signed in.', email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Serve existing website and insert shared header/footer.
app.get('/', (req, res) => res.redirect('/index.html'));
app.get(/^\/[^/]+\.html$/, (req, res, next) => {
  const name = path.basename(req.path);
  const file = path.join(CLIENT, name);
  if (!fs.existsSync(file)) return next();
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace('<!-- shared:header -->', fs.readFileSync(path.join(__dirname, 'partials/header.html'), 'utf8'));
  html = html.replace('<!-- shared:footer -->', fs.readFileSync(path.join(__dirname, 'partials/footer.html'), 'utf8'));
  res.type('html').send(html);
});
app.use(express.static(CLIENT));

if (!fs.existsSync(USERS_FILE)) saveUsers([]);
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
