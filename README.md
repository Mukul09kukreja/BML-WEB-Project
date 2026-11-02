# StockPie — simple BML_WEB evaluation project

Backend: Node.js + Express + JSON file. No MongoDB and no cloud database.

## Run

1. Install Node.js.
2. Open this StockPie directory in VS Code terminal.
3. Run `npm install`.
4. Run `npm run dev` (or `npm start`).
5. Visit `http://localhost:3000/sign-in.html`.

Use "Create account" to sign up, then sign in.

## Backend files

- `server/server.js`: Express routes for sign up and sign in and serves frontend HTML.
- `server/users.json`: Stores registered emails + bcrypt password hashes, initially `[]`. Created automatically if missing.
- `client/js/auth.js`: Frontend form requests.

## API

- `POST /api/signup` with `{ "email": "test@example.com", "password": "password123" }` adds a user if email is not registered.
- `POST /api/signin` with the same JSON checks credentials.

## Viva

- **JSON** = text format for storing structured data (here an array of objects).
- **Express** = Node.js framework that handles routes and requests.
- **POST** = HTTP method for sending form data to server.
- **bcrypt.hash** = securely hashes password before saving; hash is one-way.
- **bcrypt.compare** = tests entered password against stored hash.
- **fs.readFileSync / fs.writeFileSync** = read/write JSON file.
- **Status 201** = created, **400** = invalid input, **409** = duplicate email, **401** = invalid credentials.

## Important limitations

This is for a classroom evaluation. JSON file writes are not suitable for many concurrent users or deployment with temporary file storage. Sign in does not establish a secure server-side session, and the portfolio page is not an authenticated/protected route. Never publicly upload `server/users.json` containing real user data.
