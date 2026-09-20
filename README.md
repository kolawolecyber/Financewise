# FinanceWise Frontend

FinanceWise is a React/Vite personal finance frontend for budgets, expenses, transactions, categories, goals, and profile settings.

## Requirements

- Node.js 18 or newer
- A running FinanceWise backend

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend URL. The local default is `http://localhost:5000`.

## Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
npm test          # Run Vitest tests
```

## Authentication and security

Authentication uses the backend `financewise_token` HTTP-only cookie. The frontend does not store authentication tokens in browser storage or attach bearer tokens from JavaScript. Axios sends requests with `withCredentials: true`.

The backend deployment must:

- Allow the exact frontend origin through CORS.
- Set `credentials: true` for CORS.
- Never use `Access-Control-Allow-Origin: *` with credentials.
- Configure the cookie as `HttpOnly`, `Secure` in production, and `SameSite` for the deployment topology.
- Provide `POST /api/auth/logout` to clear the session cookie.
- Enforce authenticated-user ownership for every resource query and mutation.
- Use CSRF protection or strict `Origin` validation for state-changing requests.

The local `.env` file is intentionally ignored and must not be committed. Use `.env.example` as the public template.

## Data synchronization

Successful mutations refresh mounted views in the current tab. Window focus and cross-tab storage events also trigger refreshes. True multi-device realtime updates require backend WebSocket or SSE events; this frontend currently does not open a realtime connection.

## Deployment

Configure `VITE_API_BASE_URL` in the hosting provider environment settings. Do not commit secrets or local environment files. Vercel response headers include MIME sniffing protection, frame protection, a strict referrer policy, permissions policy, and a Content Security Policy.
