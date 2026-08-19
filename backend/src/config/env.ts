/**
 * Environment configuration.
 * Reads and validates required environment variables at startup.
 * Throws early if critical values are missing.
 */

export type AIProviderType = 'openrouter' | 'mock';

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  aiProvider: (process.env.AI_PROVIDER ?? 'mock') as AIProviderType,
  aiApiKey: process.env.AI_API_KEY ?? '',
  aiBaseUrl: process.env.AI_BASE_URL ?? 'https://openrouter.ai/api/v1',
  aiModel: process.env.AI_MODEL ?? 'openai/gpt-oss-20b:free',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
} as const;

export function validateConfig(): void {
  if (config.aiProvider !== 'openrouter' && config.aiProvider !== 'mock') {
    throw new Error(
      `AI_PROVIDER must be "openrouter" or "mock". Received: "${config.aiProvider}".`
    );
  }

  if (config.aiProvider === 'openrouter' && !config.aiApiKey) {
    throw new Error(
      'AI_API_KEY environment variable is required when AI_PROVIDER is "openrouter".\n' +
        'For local development without an API key, set AI_PROVIDER=mock.'
    );
  }
}
