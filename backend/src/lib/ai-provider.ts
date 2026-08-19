import OpenAI from 'openai';
import { config } from '../config/env';

/**
 * AI provider abstraction.
 *
 * All provider-specific code lives here. If we switch from OpenRouter to
 * another provider, only this file needs to change.
 *
 * OpenRouter uses an OpenAI-compatible API, so we reuse the `openai` SDK
 * with a custom base URL and model identifier.
 */

const REQUEST_TIMEOUT_MS = 30_000;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: config.aiApiKey,
      baseURL: config.aiBaseUrl,
      defaultHeaders: {
        'X-Title': 'Stunning AI App Builder',
      },
    });
  }
  return client;
}

export interface AIRequestOptions {
  systemPrompt: string;
  userMessage: string;
}

/**
 * Sends a request to the AI provider (OpenRouter).
 * The system prompt and user message are kept separate as distinct
 * roles so the model treats them with appropriate context weight.
 *
 * @throws Error if the request fails or times out
 */
export async function generateFromAI(options: AIRequestOptions): Promise<string> {
  const { systemPrompt, userMessage } = options;

  const client = getClient();

  let response;
  try {
    response = await client.chat.completions.create(
      {
        model: config.aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      },
      { timeout: REQUEST_TIMEOUT_MS }
    );
  } catch (err) {
    if (err instanceof Error && err.name === 'APITimeoutError') {
      throw new Error('AI request timed out after 30 seconds.');
    }
    throw err;
  }

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return text;
}
