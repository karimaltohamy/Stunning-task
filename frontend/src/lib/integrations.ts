import type { Integration } from '../types';

/**
 * Centralized integration metadata.
 * This is the single source of truth for integration data across the UI.
 * IDs must match the backend's VALID_INTEGRATION_IDS exactly.
 */
export const INTEGRATIONS: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: 'payments',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: 'shopping_cart',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: 'mail',
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'forum',
  },
  {
    id: 'google-sheets',
    name: 'Sheets',
    icon: 'table_view',
  },
];

/**
 * Returns the display name for a given integration ID.
 */
export function getIntegrationName(id: string): string {
  return INTEGRATIONS.find((i) => i.id === id)?.name ?? id;
}
