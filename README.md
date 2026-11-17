# StockPie

An Indian stock market simulator. Accounts start with ₹10,00,000 in virtual cash and can buy or sell supported NSE stocks using Yahoo Finance quotes through `yfinance`. MongoDB stores accounts, persistent sessions, holdings and trade history.

## Setup

1. Install Node.js 22 or later and run `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`, `MONGODB_DB_NAME`, and a `SESSION_SECRET` of at least 32 characters.
4. Install Python 3.9 or later, then install the quote data packages with `pip install -r requirements.txt`.
5. Run `npm run dev` and open `http://localhost:3000`.

The server never sends orders to a broker. Purchases debit virtual cash; sales credit it and calculate realized gains using FIFO. Money movements use integer paise. Total equity includes cash and holdings. Existing accounts retain their holdings and receive the same starting cash; their earlier purchases remain outside the new trade history.

## Main API

- `POST /api/signup` — `{ "username": "alex_123", "password": "at-least-8-chars" }`
- `POST /api/signin` — same fields
- `POST /api/signout`
- `GET /api/session`
- `GET /api/quotes` — current supported NSE quotes from Yahoo Finance
- `GET /api/market/stream` — quote updates for the website
- `GET /api/portfolio` — the signed-in user's holdings and calculated value
- `POST /api/portfolio/buy` or `/api/portfolio/sell` — `{ "symbol": "RELIANCE", "quantity": 2 }`

Trade requests also require an `Idempotency-Key` header (a UUID). Reuse that key when retrying the same trade; a confirmed trade will not execute twice. Concurrent changes use optimistic concurrency control. Demo accounts allow up to 10,000 trades; earlier request IDs remain available for safe retries. Portfolio responses show the latest 50 trades and include `tradeCount`. Existing history is preserved.

Authentication allows ten attempts per IP per minute per server process. Production assumes one trusted reverse proxy terminating HTTPS; adjust `trust proxy` for other deployments.

For POST requests, first call `GET /api/session` and send its `csrf` value in the `X-CSRF-Token` header. Passwords are stored as bcrypt hashes.

Five-minute candles are fetched in one batch every three minutes. Trading is paused if the quote is older than 15 minutes or the last successful fetch is older than four minutes. This includes overnight and weekend quotes; delayed feeds may also pause trading. Quote times are shown in IST. Missing daily changes are shown as unavailable. `yfinance` retrieves Yahoo Finance data, which can be delayed or temporarily unavailable. The `yfinance` project describes itself as an open-source tool to access Yahoo Finance data; review Yahoo's terms before using the feed beyond a personal or educational project.

## Code organization

The backend follows this request flow: **router → middleware → controller → service/model → response**. `server/app.js` assembles these parts; `server/server.js` connects MongoDB and starts the server.

| Folder | Responsibility |
| --- | --- |
| `server/routers` | URL declarations and handler connections |
| `server/controllers` | Request validation and responses |
| `server/middleware` | Sessions, CSRF, account checks, rate limits and errors |
| `server/models` | MongoDB account schema |
| `server/services` | Quote fetching, trading and portfolio calculations |
| `server/storage` | Persistent session storage |
| `server/data` | Supported stocks |
| `server/helpers` | Python quote helper |
| `server/partials` | Existing shared header and footer |
| `client/js/shared` | Browser API, navigation, preferences and shared appearance |
| `client/js/pages` | Scripts for individual pages and home-page widgets |
| `client/js/data` | Illustrative charts and educational article data |

For a backend issue, start with the matching router and follow its named controller handler. Check services for calculation or feed issues, and middleware for access or session issues. For a browser issue, start with the corresponding page script. HTML script order loads shared helpers before the page scripts that use them.
