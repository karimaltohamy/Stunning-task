# Stunning AI App Builder

An AI-powered app builder where users describe what they want to build, select integrations, and receive a detailed AI-generated architecture and implementation plan.

## Overview

Users enter a natural-language prompt describing their application, select relevant integrations (Stripe, Shopify, Gmail, Slack, Google Sheets), and click **Initialize Build**. The backend builds a tailored system prompt incorporating the selected integrations, calls the configured AI provider, and returns a structured architecture plan.

## AI Provider

The application supports two providers:

- **OpenRouter** — real AI generation via the OpenRouter API (OpenAI-compatible). Requires an API key.
- **Mock** — generates a realistic structured response locally without any external API call. Used for local development and demos.

By default, `AI_PROVIDER` is set to `mock`, so the project runs out of the box without an API key.

### Mock mode

```env
AI_PROVIDER=mock
```

No `AI_API_KEY` is required. The mock provider dynamically builds a response based on the user's prompt and selected integrations.

### OpenRouter mode

```env
AI_PROVIDER=openrouter
AI_API_KEY=sk-or-v1-your-key-here
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-oss-20b:free
```

When `AI_PROVIDER` is `openrouter`, the backend validates that `AI_API_KEY` is set at startup and fails fast with a clear error message if it's missing.

The frontend automatically shows a "Demo AI Mode" indicator when the mock provider is active. No UI changes are needed when switching providers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v3 |
| Backend | Fastify 4, TypeScript, Zod |
| AI Provider | OpenRouter (via `openai` SDK) or Mock provider |
| Validation | Zod (backend), client-side guards (frontend) |

## Architecture

```
User Browser (React + Vite, :5173)
        ↓  POST /api/generate
Fastify Backend (:3000)
        ↓  generation.controller → Zod validation
        ↓  generation.service → buildSystemPrompt()
        ↓  provider-factory.ts → selects AIProvider
        ↓    ├── OpenRouterAIProvider → OpenRouter API
        ↓    └── MockAIProvider → local generation
        ↓
Response returned → ResponseCard renders structured output
```

## Project Structure

```
project/
├── frontend/         # Vite React application
│   └── src/
│       ├── components/       # Navbar, Footer, IntegrationChip
│       ├── features/composer/ # ComposerCard, ResponseCard
│       ├── hooks/            # useGeneration
│       ├── lib/              # integrations metadata
│       ├── services/         # generation.service (API layer)
│       └── types/            # shared TypeScript types
│
├── backend/          # Fastify API server
│   └── src/
│       ├── modules/generation/ # controller, service, schema, types
│       ├── config/             # environment config
│       ├── plugins/            # CORS
│       ├── lib/                # ai-provider, mock-provider, provider-factory
│       └── utils/              # buildSystemPrompt
│
├── README.md
├── DECISIONS.md
├── TECH.md
└── .gitignore
```

## Setup

### Prerequisites

- Node.js 18+
- (Optional) An OpenRouter API key — get one free at [openrouter.ai/keys](https://openrouter.ai/keys)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# For mock mode: no changes needed — works out of the box
# For real AI: set AI_PROVIDER=openrouter and AI_API_KEY=your_key

# Start development server
npm run dev
```

The backend will start at `http://localhost:3000`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment (optional — defaults to http://localhost:3000)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_PROVIDER` | No | `"mock"` or `"openrouter"` (default: `mock`) |
| `AI_API_KEY` | Only if `AI_PROVIDER=openrouter` | OpenRouter API key (starts with `sk-or-`) |
| `AI_BASE_URL` | No | API base URL (default: `https://openrouter.ai/api/v1`) |
| `AI_MODEL` | No | Model identifier (default: `openai/gpt-oss-20b:free`) |
| `PORT` | No | Server port (default: `3000`) |
| `FRONTEND_URL` | No | Allowed CORS origin in production (default: `http://localhost:5173`) |
| `NODE_ENV` | No | `development` or `production` (default: `development`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL (default: `http://localhost:3000`) |

## API

### `POST /api/generate`

Generates an AI architecture plan based on the user's prompt and selected integrations.

**Request:**

```json
{
  "prompt": "Build a restaurant ordering dashboard",
  "integrations": ["stripe", "slack"]
}
```

**Response (200):**

```json
{
  "data": {
    "title": "Restaurant Ordering Dashboard",
    "summary": "A restaurant ordering dashboard with 2 integrations...",
    "features": [
      "Real-time analytics dashboard with key metrics",
      "Admin panel for managing records and users",
      "Product catalog with search and filtering",
      "Shopping cart and checkout flow"
    ],
    "integrations": [
      {
        "name": "Stripe",
        "purpose": "Handle online payments, subscriptions, and checkout flows..."
      },
      {
        "name": "Slack",
        "purpose": "Post real-time alerts (new orders, errors, deployment status)..."
      }
    ],
    "suggestedStack": [
      "React + TypeScript (frontend)",
      "Node.js + Express (API server)",
      "PostgreSQL (primary database)",
      "Stripe SDK + webhook signature verification",
      "Slack Web API + bot token"
    ],
    "architecture": "The Restaurant Ordering Dashboard follows a standard three-tier architecture..."
  },
  "provider": "mock"
}
```

**Error (400):**

```json
{
  "error": "Prompt cannot be empty."
}
```

**Error (429):**

```json
{
  "error": "The AI service is busy. Please wait a moment and try again."
}
```

**Error (500):**

```json
{
  "error": "Something went wrong while generating your response. Please try again."
}
```

**Valid integration IDs:** `stripe`, `shopify`, `gmail`, `slack`, `google-sheets`

**Constraints:**
- Prompt: 1–2000 characters
- Integrations: subset of valid IDs above (empty array is allowed)

### `GET /api/status`

Returns the current AI provider mode.

```json
{
  "provider": "mock"
}
```

### `GET /health`

Returns `{ "status": "ok" }`. Useful for uptime checks.

## Tests

```bash
cd backend
npm test
```

Tests cover:
- Mock provider response structure and integration-awareness
- Provider factory selection
- Empty integrations handling
- Missing API key validation when `AI_PROVIDER=openrouter`
- Mock mode working without API key
