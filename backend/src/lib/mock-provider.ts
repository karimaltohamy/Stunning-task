import type {
  AIProvider,
  AIProviderInput,
  GenerationData,
  IntegrationId,
  IntegrationPlan,
} from '../modules/generation/generation.types';

/**
 * MockAIProvider
 *
 * Generates a realistic structured response without making any external
 * AI request. Used for local development and demos when no AI API key
 * is available.
 *
 * The response is dynamically built from the user's prompt and selected
 * integrations — it does NOT return a static string.
 */

const INTEGRATION_META: Record<
  IntegrationId,
  { name: string; purpose: string; stackNote: string }
> = {
  stripe: {
    name: 'Stripe',
    purpose:
      'Handle online payments, subscriptions, and checkout flows via Stripe Checkout and webhooks for payment event synchronization.',
    stackNote: 'Stripe SDK + webhook signature verification',
  },
  shopify: {
    name: 'Shopify',
    purpose:
      'Sync product catalog, manage orders, and pull customer data through the Shopify Admin API with OAuth-based store connection.',
    stackNote: 'Shopify Admin API + OAuth flow',
  },
  gmail: {
    name: 'Gmail',
    purpose:
      'Send transactional emails, order confirmations, and notification digests using the Gmail API with OAuth2 token management.',
    stackNote: 'Gmail API + OAuth2 token refresh',
  },
  slack: {
    name: 'Slack',
    purpose:
      'Post real-time alerts (new orders, errors, deployment status) to designated Slack channels via incoming webhooks or the Slack Bot API.',
    stackNote: 'Slack Web API + bot token',
  },
  'google-sheets': {
    name: 'Google Sheets',
    purpose:
      'Export structured data (orders, signups, analytics) to Google Sheets for reporting and lightweight data pipelines via the Sheets API.',
    stackNote: 'Google Sheets API + service account auth',
  },
};

/**
 * Derives a concise project title from the user's prompt.
 */
function deriveTitle(prompt: string): string {
  const cleaned = prompt.trim().replace(/^(build|create|make|design|develop)\s+/i, '');
  const words = cleaned.split(/\s+/).slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Derives a set of plausible features from the prompt keywords.
 */
function deriveFeatures(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const features: string[] = [];

  if (/dashboard|admin|manage/.test(lower)) {
    features.push('Real-time analytics dashboard with key metrics');
    features.push('Admin panel for managing records and users');
  }
  if (/order|shop|store|e-commerce|commerce/.test(lower)) {
    features.push('Product catalog with search and filtering');
    features.push('Shopping cart and checkout flow');
    features.push('Order tracking and status updates');
  }
  if (/notif|alert|email|message/.test(lower)) {
    features.push('Automated notification system for key events');
  }
  if (/user|auth|account|login/.test(lower)) {
    features.push('User authentication with role-based access control');
  }
  if (/track|monitor|analytic|report/.test(lower)) {
    features.push('Activity logging and audit trail');
  }
  if (/chat|messag|communic/.test(lower)) {
    features.push('Real-time messaging with WebSocket updates');
  }

  if (features.length === 0) {
    features.push('Core CRUD operations for primary entities');
    features.push('Search and filtering capabilities');
    features.push('User authentication and session management');
    features.push('Responsive UI optimized for desktop and mobile');
  }

  return features.slice(0, 6);
}

export class MockAIProvider implements AIProvider {
  async generate(input: AIProviderInput): Promise<GenerationData> {
    const { prompt, integrations } = input;

    const title = deriveTitle(prompt);
    const features = deriveFeatures(prompt);

    const integrationPlans: IntegrationPlan[] = integrations.map((id) => ({
      name: INTEGRATION_META[id].name,
      purpose: INTEGRATION_META[id].purpose,
    }));

    const suggestedStack = [
      'React + TypeScript (frontend)',
      'Node.js + Express (API server)',
      'PostgreSQL (primary database)',
      'Redis (caching and queues)',
      ...integrations.map((id) => INTEGRATION_META[id].stackNote),
    ];

    const integrationSection =
      integrations.length > 0
        ? integrations
            .map((id) => `- ${INTEGRATION_META[id].name}: ${INTEGRATION_META[id].purpose}`)
            .join('\n')
        : 'No external integrations were selected. The application will operate as a standalone system.';

    const architecture = `The ${title} follows a standard three-tier architecture. The frontend is a React SPA communicating with a RESTful Node.js API layer. The API layer handles business logic, validation, and acts as the integration gateway. PostgreSQL serves as the primary data store with Redis for caching and session management.\n\nIntegration layer:\n${integrationSection}\n\nThe API exposes endpoints for all CRUD operations, with JWT-based authentication and role-based authorization. Background jobs (notifications, data sync) are processed via a lightweight queue. The frontend uses a component-based architecture with shared design tokens for consistent theming.`;

    const summary =
      integrations.length > 0
        ? `A ${title.toLowerCase()} application with ${integrations.length} integration${integrations.length > 1 ? 's' : ''} (${integrations.map((id) => INTEGRATION_META[id].name).join(', ')}). The system provides ${features.length} core features with a scalable architecture ready for production deployment.`
        : `A ${title.toLowerCase()} application with no external integrations. The system provides ${features.length} core features as a standalone platform with a clean, scalable architecture ready for production deployment.`;

    return {
      title,
      summary,
      features,
      integrations: integrationPlans,
      suggestedStack,
      architecture,
    };
  }
}
