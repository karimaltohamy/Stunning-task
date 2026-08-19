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

export interface GenerationResponse {
  data: GenerationData;
  provider: 'openrouter' | 'mock';
}

export interface GenerationErrorResponse {
  error: string;
}

export interface StatusResponse {
  provider: 'openrouter' | 'mock';
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';
