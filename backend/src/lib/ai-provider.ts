import OpenAI from 'openai';
import { config } from '../config/env';
import type {
  AIProvider,
  AIProviderInput,
  GenerationData,
  IntegrationId,
} from '../modules/generation/generation.types';

/**
 * OpenRouterAIProvider
 *
 * Calls the OpenRouter API (OpenAI-compatible) to generate a structured
 * architecture plan. All provider-specific code lives here.
 *
 * The AI is instructed via the system prompt to return JSON matching
 * the GenerationData interface. If the AI returns non-JSON text, it is
 * wrapped into a GenerationData shape as a fallback.
 */

const REQUEST_TIMEOUT_MS = 60_000;

const INTEGRATION_NAMES: Record<IntegrationId, string> = {
  stripe: 'Stripe',
  shopify: 'Shopify',
  gmail: 'Gmail',
  slack: 'Slack',
  'google-sheets': 'Google Sheets',
};

export class OpenRouterAIProvider implements AIProvider {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: config.aiApiKey,
        baseURL: config.aiBaseUrl,
        defaultHeaders: {
          'X-Title': 'Stunning AI App Builder',
        },
      });
    }
    return this.client;
  }

  async generate(input: AIProviderInput): Promise<GenerationData> {
    const { systemPrompt, prompt, integrations } = input;

    const client = this.getClient();

    let response;
    try {
      response = await client.chat.completions.create(
        {
          model: config.aiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        },
        { timeout: REQUEST_TIMEOUT_MS }
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'APITimeoutError') {
        throw new Error('AI request timed out after 60 seconds.');
      }
      throw err;
    }

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error('AI provider returned an empty response.');
    }

    return this.parseResponse(text, prompt, integrations);
  }

  /**
   * Parses the AI response text into a GenerationData object.
   * If the AI returned valid JSON, parse it directly.
   * Otherwise, wrap the raw text as a fallback.
   */
  private parseResponse(
    text: string,
    prompt: string,
    integrations: IntegrationId[]
  ): GenerationData {
    try {
      const parsed = JSON.parse(text);
      if (
        typeof parsed.title === 'string' &&
        typeof parsed.summary === 'string' &&
        Array.isArray(parsed.features) &&
        Array.isArray(parsed.integrations) &&
        Array.isArray(parsed.suggestedStack) &&
        typeof parsed.architecture === 'string'
      ) {
        return parsed as GenerationData;
      }
    } catch {
      // Not valid JSON — fall through to fallback
    }

    return {
      title: prompt.slice(0, 60),
      summary: text.slice(0, 200),
      features: [],
      integrations: integrations.map((id) => ({
        name: INTEGRATION_NAMES[id],
        purpose: 'Integration details unavailable.',
      })),
      suggestedStack: [],
      architecture: text,
    };
  }
}
