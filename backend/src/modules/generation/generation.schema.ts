import { z } from 'zod';

/**
 * Valid integration IDs — the exhaustive list of supported integrations.
 * Any ID not in this list will be rejected with a 400 error.
 */
export const VALID_INTEGRATION_IDS = [
  'stripe',
  'shopify',
  'gmail',
  'slack',
  'google-sheets',
] as const;

export const GenerationRequestSchema = z.object({
  prompt: z
    .string({ required_error: 'Prompt is required.' })
    .trim()
    .min(1, 'Prompt cannot be empty.')
    .max(2000, 'Prompt must be 2000 characters or fewer.'),
  integrations: z
    .array(z.enum(VALID_INTEGRATION_IDS), {
      invalid_type_error: 'Integrations must be an array of valid integration IDs.',
    })
    .default([]),
});

export type GenerationRequestInput = z.infer<typeof GenerationRequestSchema>;
