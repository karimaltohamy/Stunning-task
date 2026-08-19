# Stunning AI App Builder

An AI-powered app builder where users describe what they want to build, select integrations, and receive a detailed AI-generated architecture and implementation plan.

## Overview

Users enter a natural-language prompt describing their application, select relevant integrations (Stripe, Shopify, Gmail, Slack, Google Sheets), and click **Initialize Build**. The backend builds a tailored system prompt incorporating the selected integrations, sends it to the OpenRouter API (using a free model), and returns a structured architecture plan.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v3 |
| Backend | Fastify 4, TypeScript, Zod |
| AI Provider | OpenRouter (Llama 3.3 70B free) via `openai` SDK |
| Validation | Zod (backend), client-side guards (frontend) |

## Architecture

```
User Browser (React + Vite, :5173)
        ↓  POST /api/generate
Fastify Backend (:3000)
        ↓  generation.controller → Zod validation
        ↓  generation.service → buildSystemPrompt()
        ↓  ai-provider.ts → OpenRouter API
        ↓
Response returned → ResponseCard renders output
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
│       ├── lib/                # ai-provider abstraction
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
- An OpenRouter API key — get one free at [openrouter.ai/keys](https://openrouter.ai/keys)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and set AI_API_KEY=your_openrouter_key_here

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
| `AI_API_KEY` | **Yes** | OpenRouter API key (starts with `sk-or-`) |
| `AI_BASE_URL` | No | API base URL (default: `https://openrouter.ai/api/v1`) |
| `AI_MODEL` | No | Model identifier (default: `meta-llama/llama-3.3-70b-instruct:free`) |
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
  "response": "## Architecture Overview\n\n..."
}
```

**Error (400):**

```json
{
  "error": "Prompt cannot be empty."
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

### `GET /health`

Returns `{ "status": "ok" }`. Useful for uptime checks.
