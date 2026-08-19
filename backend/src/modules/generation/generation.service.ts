import { getAIProvider } from '../../lib/provider-factory';
import { buildSystemPrompt } from '../../utils/system-prompt';
import { config } from '../../config/env';
import type { GenerationRequest, GenerationResponse } from './generation.types';

/**
 * Generation service.
 *
 * Responsible for:
 * 1. Receiving validated input
 * 2. Building the system prompt (incorporating selected integrations)
 * 3. Calling the AI provider via the AIProvider abstraction
 * 4. Returning the generated response with provider metadata
 *
 * Does NOT handle HTTP concerns — that belongs to the controller.
 * Does NOT know which concrete provider is active — that is decided
 * by the provider factory.
 */
export async function generateResponse(
  request: GenerationRequest
): Promise<GenerationResponse> {
  const { prompt, integrations } = request;

  const systemPrompt = buildSystemPrompt(integrations);

  const provider = getAIProvider();

  const data = await provider.generate({
    prompt,
    integrations,
    systemPrompt,
  });

  return {
    data,
    provider: config.aiProvider,
  };
}
