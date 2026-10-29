// Tiny Node server for StockPie: serves the site and saves accounts to data/users.json
// Run with:  node server.js   (Node 18+, no npm install needed)

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const ROOT = __dirname;
const USERS_FILE = path.join(ROOT, 'data', 'users.json');

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
};

// ---------- user storage ----------
function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }   // file missing or empty -> no users yet
}

function saveUsers(users) {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// never store the real password, only a salted hash
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// ---------- helpers ----------
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) { req.destroy(); reject(new Error('Body too large')); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

// ---------- API ----------
async function handleApi(req, res) {
  let data;
  try { data = await readBody(req); }
  catch (err) { return sendJson(res, 400, { error: err.message }); }

  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendJson(res, 400, { error: 'Please enter a valid email address.' });
  }
  if (password.length < 8) {
    return sendJson(res, 400, { error: 'Password must be at least 8 characters.' });
  }

  const users = readUsers();
  const existing = users.find(u => u.email === email);

  if (req.url === '/api/signup') {
    if (existing) return sendJson(res, 409, { error: 'An account with this email already exists.' });

    const salt = crypto.randomBytes(16).toString('hex');
    users.push({
      email,
      salt,
      passwordHash: hashPassword(password, salt),
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
    return sendJson(res, 201, { message: 'Account created. You can sign in now.' });
  }

  if (req.url === '/api/signin') {
    if (!existing) return sendJson(res, 401, { error: 'Incorrect email or password.' });

    const attempt = Buffer.from(hashPassword(password, existing.salt), 'hex');
    const saved = Buffer.from(existing.passwordHash, 'hex');
    if (!crypto.timingSafeEqual(attempt, saved)) {
      return sendJson(res, 401, { error: 'Incorrect email or password.' });
    }
    return sendJson(res, 200, { message: 'Signed in.' });
  }

  sendJson(res, 404, { error: 'Not found' });
}

// ---------- static files ----------
function serveFile(req, res) {
  const urlPath = req.url.split('?')[0];
  const name = urlPath === '/' ? 'index.html' : path.basename(urlPath);  // basename blocks ../ tricks
  const ext = path.extname(name);

  if (!TYPES[ext]) { res.writeHead(404); return res.end('Not found'); }

  fs.readFile(path.join(ROOT, name), (err, content) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[ext] });
    res.end(content);
  });
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/api/')) return handleApi(req, res);
  if (req.method === 'GET') return serveFile(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => console.log(`StockPie running at http://localhost:${PORT}`));