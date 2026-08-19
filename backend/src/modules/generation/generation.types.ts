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

export interface GenerationResponse {
  response: string;
}

export interface GenerationErrorResponse {
  error: string;
}
