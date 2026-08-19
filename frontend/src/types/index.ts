/**
 * Shared TypeScript types for the frontend application.
 */

export type IntegrationId =
  | 'stripe'
  | 'shopify'
  | 'gmail'
  | 'slack'
  | 'google-sheets';

export interface Integration {
  id: IntegrationId;
  name: string;
  icon: string; // Material Symbol icon name
}

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

export type AppState = 'idle' | 'loading' | 'success' | 'error';
