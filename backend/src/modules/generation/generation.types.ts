/**
 * TypeScript types for the generation module.
 */

export type IntegrationId =
  | 'stripe'
  | 'shopify'
  | 'gmail'
  | 'slack'
  | 'google-sheets';

export interface GenerationRequest {
  prompt: string;
  integrations: IntegrationId[];
}

/**
 * Structured data returned by both the real AI provider and the mock provider.
 * Both providers MUST return this exact shape so the frontend can render
 * either response without separate logic.
 */
export interface IntegrationPlan {
  name: string;
  purpose: string;
}

export interface GenerationData {
  title: string;
  summary: string;
  features: string[];
  integrations: IntegrationPlan[];
  suggestedStack: string[];
  architecture: string;
}

/**
 * Response sent to the frontend.
 * Includes the provider field so the frontend can show a demo indicator.
 */
export interface GenerationResponse {
  data: GenerationData;
  provider: 'openrouter' | 'mock';
}

export interface GenerationErrorResponse {
  error: string;
}

/**
 * Input passed to an AIProvider implementation.
 */
export interface AIProviderInput {
  prompt: string;
  integrations: IntegrationId[];
  systemPrompt: string;
}

/**
 * Clean abstraction over AI generation.
 * Both OpenRouterAIProvider and MockAIProvider implement this interface.
 * The generation service depends on this abstraction, not on any concrete provider.
 */
export interface AIProvider {
  generate(input: AIProviderInput): Promise<GenerationData>;
}
