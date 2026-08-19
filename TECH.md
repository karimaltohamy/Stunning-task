# TECH.md — Vercel AI SDK 4.0

## What is it?

The Vercel AI SDK (currently at version 4.x) is a TypeScript library that provides a unified interface for working with AI providers — OpenAI, Anthropic, Google Gemini, Mistral, and others — through a single, consistent API. Beyond provider abstraction, its most significant features are first-class streaming support, a React hooks layer (`useChat`, `useCompletion`) that handles streaming state directly in components, and structured output generation with schema validation.

Released in late 2024, version 4 introduced a major architecture overhaul: the provider-specific adapters were fully decoupled into separate packages (`@ai-sdk/openai`, `@ai-sdk/google`, etc.), and the streaming API was redesigned around the native Web Streams API rather than a custom protocol.

## How could Stunning use it?

Stunning would benefit from the AI SDK in three concrete ways:

**1. Provider-agnostic backend**
Right now, `ai-provider.ts` uses the `openai` SDK pointed at OpenRouter with a hardcoded model. Replacing it with the Vercel AI SDK means switching to a different model (or a different provider entirely) is a one-line change. You can also implement model fallback — if Llama 3.3 70B fails, automatically retry with a different free model — without writing custom retry logic.

**2. Streaming responses**
The most user-visible improvement. Instead of waiting 10–20 seconds for the full response and then rendering it all at once, the AI SDK makes it straightforward to stream the response token-by-token. The backend uses `streamText()` and returns a streaming response. The frontend uses the `useCompletion` hook, which updates a `completion` string in real time. The user sees the architecture plan being written out live, which dramatically improves perceived performance.

```ts
// Backend — instead of client.chat.completions.create()
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await streamText({
  model: openai('gpt-4o-mini'),
  system: systemPrompt,
  prompt: userMessage,
});

return result.toDataStreamResponse();
```

**3. Structured output**
For Stunning, the AI response could be a structured JSON object (project name, components list, file tree, tech stack recommendations) rather than free-form markdown. The AI SDK's `generateObject()` with a Zod schema would enforce this structure, making the response reliably parseable by the frontend to render the bento-grid component layout seen in the design.

## What are its limitations?

**Streaming requires infrastructure changes.** You cannot use streaming with a standard JSON POST endpoint. You need to either set up SSE (Server-Sent Events) or use the Vercel AI SDK's built-in data stream protocol. This works seamlessly if you're deploying to Vercel (it's designed for Next.js API routes and Vercel Edge Functions). On a standalone Fastify server, it requires more manual wiring.

**The abstraction leaks.** Provider-specific features (like OpenAI's structured outputs, or Claude's extended thinking mode) require dropping into provider-specific configuration options. The unified API doesn't cover the full feature surface of any individual provider.

**Version churn.** The SDK moved from v3 to v4 with breaking changes in less than a year, including renamed packages and a redesigned streaming protocol. Projects that pinned v3 had to migrate. This is a real maintenance concern for a production system.

**Not helpful for simple non-streaming use cases.** For a basic request-response pattern (which is what Stunning uses now), the AI SDK adds dependency weight without meaningful benefit over calling OpenRouter via the `openai` SDK directly. The value is specifically in streaming and structured output.

## Would you use it today?

**Yes, with one condition: only if streaming is a requirement.**

If the product roadmap calls for real-time streaming responses (which it should, given the nature of an AI app builder), the Vercel AI SDK is the right choice. It saves a significant amount of boilerplate, handles the streaming protocol correctly, and the `useCompletion` hook is genuinely better than building streaming state management by hand.

If the application will remain request-response only (generate → wait → render), calling OpenRouter directly via the `openai` SDK is simpler, has fewer moving parts, and avoids the dependency. The AI SDK's value is tightly coupled to streaming.

The current implementation in this project uses OpenRouter via the `openai` SDK for exactly this reason — streaming is the right next step, but adding it without using it would be premature complexity.
