# Presenting the simplified prototype

Start from the repository root: `node server/server.js`, then open http://localhost:3000. Create a demonstration account before signing in; use fictional details.

## Four-minute demo

| Step | Demonstration | Where to point in code |
|---|---|---|
| 1 | Open About and Contact from navigation | HTML pages and `server/partials/header.html` |
| 2 | Markets: select ETFs, search VOO, sort price, star a fund and reload | `client/js/markets.js`: `render()` and its event listeners |
| 3 | Home: move a calculator slider and save/reload | `client/js/calculator.js`: `update()` and the monthly loop |
| 4 | Sign in; show Portfolio's holdings/watchlist and change chart range | `auth.js`, `portfolio.js`, `main.js` |
| 5 | Contact: submit empty, fix fields, submit a valid message | `contact.js`: submit handler, `reportValidity()`, `UI.postJson()` |
| 6 | Open `server/data/contact.json` and find the returned ID | `server/server.js`: contact route; `server/storage.js`: `updateJson()` |

## The three flows to understand

**Rendering:** an event calls a function, the function reads inputs, calculates/filter results, and changes DOM elements. Markets uses `filter` to choose assets, `sort` to order them and `map`/`join` to make rows. Each new star button gets a click listener. Search updates immediately; there is no debounce timer.

**Submission:** the submit listener calls `preventDefault()` to avoid a page reload. `reportValidity()` asks the browser to check `required`, `type="email"` and length constraints. `setCustomValidity()` adds a short custom message for trimmed contact text or password length. Clear it on input so the user can correct the field. The handler then awaits `UI.postJson()`, displays success/error, and re-enables its button in `finally`.

**Persistence:** Node parses incoming JSON, validates it again, and calls `updateJson()`. That helper reads the current array, changes it, writes a temporary file and renames it over the original. These operations are synchronous: one finishes before the process handles the next operation. No Promise write queue or database engine is involved. JSON parse errors are reported rather than overwriting existing records.

## Common questions

| Question | Plain answer |
|---|---|
| Why are the header/footer separate? | They are shared HTML. The server makes two string replacements before sending each page, so one edit updates navigation everywhere. |
| What does async/await mean here? | Pause this handler until the HTTP request/response finishes, then continue with the result. It keeps submission code in a readable order. |
| Why validate twice? | Browser checks help the user, but someone can send a request directly. The server must check before saving. |
| Why does the server collect chunks? | An HTTP body may arrive in pieces. `readBody()` waits until the request ends before parsing it and limits its size. |
| What is localStorage? | Browser string storage. We use JSON.stringify/parse to store arrays/objects such as watchlists and plans. |
| Is localStorage secure authentication? | No. It only controls prototype visibility. Real protected accounts need server-verified sessions in A3. |
| How is gain calculated? | Add shares times current price and cash for value. Add shares times average cost and cash for cost. Gain is value minus cost. |
| Are charts live? | No. Range buttons select fixed example arrays. The calculator generates its own points from compound-interest calculations. |
| How does the chart draw? | `UI.plot()` places points evenly across an SVG, scales their heights and sets its line path. SVG M means move; L means draw a line. |
| Why use details/summary and dialog? | The browser provides the FAQ open/close behavior and modal Escape/focus behavior, reducing custom JavaScript. |
| Why are scripts in function wrappers? | To keep page variables private and avoid names colliding with other scripts. UI and Store are the small shared helper objects. |
| Why hash passwords? | Accounts must not store plaintext passwords. A random salt and scrypt create the stored hash; sign-in compares a newly calculated hash. |
| Why not use MongoDB now? | A2 specifically asks for local JSON persistence. MongoDB/Express and order execution are planned for A3. |

## JSON record fields

All files contain arrays. `id` is a unique record reference and `createdAt` is the server save time. Users contain normalized `email`, random `salt` and `passwordHash`. Contacts contain `name`, `email`, `topic`, `message` and `consent`. Subscribers contain `email` and `source`. JSON syntax does not allow comments.

Read and rehearse these paths yourself. The goal is to explain the actual behavior, including the prototype limits, rather than memorizing an answer to code you have not followed.
