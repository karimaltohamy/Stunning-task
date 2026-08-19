import { config } from '../config/env';
import type { AIProvider } from '../modules/generation/generation.types';
import { OpenRouterAIProvider } from './ai-provider';
import { MockAIProvider } from './mock-provider';

/**
 * Provider factory.
 *
 * Selects the AI provider implementation based on the AI_PROVIDER
 * environment variable. This is the single point where the concrete
 * provider is chosen — the generation service depends only on the
 * AIProvider abstraction.
 */

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = createProvider();
  }
  return provider;
}

function createProvider(): AIProvider {
  switch (config.aiProvider) {
    case 'openrouter':
      return new OpenRouterAIProvider();
    case 'mock':
      return new MockAIProvider();
    default:
      throw new Error(
        `Unknown AI_PROVIDER: "${config.aiProvider}". Supported values: "openrouter", "mock".`
      );
  }
}
