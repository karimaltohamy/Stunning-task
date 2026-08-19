/**
 * Environment configuration.
 * Reads and validates required environment variables at startup.
 * Throws early if critical values are missing.
 */

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  aiApiKey: process.env.AI_API_KEY ?? '',
  aiBaseUrl: process.env.AI_BASE_URL ?? 'https://openrouter.ai/api/v1',
  aiModel: process.env.AI_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
} as const;

export function validateConfig(): void {
  if (!config.aiApiKey) {
    throw new Error('AI_API_KEY environment variable is required but not set.');
  }
}
