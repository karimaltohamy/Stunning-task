# DECISIONS.md

## What did you improve?

### 1. Clean separation of concerns in the backend
The source HTML was a single static file. I introduced a proper layered architecture:
- **Controller** handles HTTP routing, request parsing, and maps errors to status codes
- **Service** handles business logic — building the system prompt and calling the AI
- **AI Provider** wraps OpenRouter — isolated so swapping providers or models requires changing only one file (or one env var)
- **Schema** contains all validation logic using Zod

This means each piece is independently understandable and testable.

### 2. System prompt designed to actually use integrations
The most important improvement: `buildSystemPrompt()` in `backend/src/utils/system-prompt.ts` constructs a prompt that meaningfully requires the AI to address each selected integration. Rather than just listing them, it instructs the model to explain exactly how each integration fits the architecture, what features use it, and key implementation considerations. The difference in response quality is significant.

### 3. Validated integration whitelist
The backend rejects any integration ID not in the known list via Zod's `z.enum()`. This prevents client-side tampering and ensures the system prompt builder only receives valid inputs.

### 4. Duplicate submission prevention
The `useGeneration` hook checks `isLoading` before accepting a new request. The Generate button is disabled while loading. This prevents the user from accidentally firing multiple AI calls that would all hit the API key quota.

### 5. User-facing error handling at every layer
The service layer catches AI timeouts separately (504 vs 500). The frontend service catches network failures and AbortSignal timeouts with distinct, readable messages. Internal errors are logged on the server but never exposed to the client.

### 6. Design system preserved faithfully
The Tailwind config in `frontend/tailwind.config.js` contains every design token from the source HTML — exact hex values, spacing units, typography scales. The CSS classes applied to each element are identical to the original. The glassmorphism panel, hero glow, and body grid background are reproduced exactly in `index.css`.

### 7. Environment config validated at startup
`validateConfig()` is called before the server begins listening. If `AI_API_KEY` is not set, the server exits immediately with a clear message instead of crashing later with a cryptic API error.

---

## What did you intentionally leave out?

### Authentication & user accounts
Not implemented. All requests are anonymous. For a production system you'd want user sessions, rate limiting per user, and API key management. Left out because it would require a database, session management, and significantly more complexity than the scope warrants.

### Database persistence
No conversation history is stored. Each generation is stateless. This would require a database (PostgreSQL/SQLite), a data model for users and generations, and a migration system. Not worth adding for a prototype.

### Real OAuth integrations
Stripe, Shopify, Gmail, Slack, and Google Sheets are dummy context-only selections. They don't make real API calls or request OAuth tokens. Implementing actual OAuth for even one integration is a substantial engineering effort (redirect flow, token storage, refresh handling) that is out of scope.

### Streaming responses
The AI response is returned as a single response rather than streamed token-by-token. Streaming would improve perceived performance (the user sees text appearing word by word). OpenRouter supports streaming, but it requires SSE or WebSocket on the backend and incremental state updates on the frontend — worth doing in a real product, left out here for simplicity.

### Rate limiting
No rate limiting is applied to the `/api/generate` endpoint. This is a real gap (see Production Risk below). Left out because it requires either a Redis store or a library like `@fastify/rate-limit`, which adds infrastructure complexity.

### Production analytics & logging
Basic Fastify pino logging is in place, but no structured analytics, error monitoring (e.g., Sentry), or request tracing. Left out because adding a monitoring service requires external account setup.

---

## What is the biggest production risk?

### AI API abuse and runaway costs

The `/api/generate` endpoint has no authentication, no rate limiting, and no per-user quota. Anyone who discovers the endpoint URL can send arbitrary requests and exhaust the OpenRouter API quota without any limit.

**Why this is the biggest risk:**
- AI API calls can be expensive at scale
- A motivated attacker (or even a bug causing a retry loop) could exhaust the API quota in minutes
- Unlike database abuse, AI cost overruns are immediate and can't be rolled back

**What I would do to mitigate it in production:**
1. **Authentication required** — all requests must be tied to a logged-in user
2. **Per-user rate limiting** — e.g., 10 requests per user per hour using Redis + `@fastify/rate-limit`
3. **Monthly spending cap** — configure a hard budget cap in the OpenRouter dashboard
4. **Prompt length enforcement** — already done (2000 char max), but worth also enforcing on the server before the AI call
5. **Request logging with user attribution** — so spikes can be investigated
6. **API key rotation** — keep the key out of environment variables in CI/CD by using a secrets manager (AWS Secrets Manager, Vault)
