import { generateFromAI } from '../../lib/ai-provider';
import { buildSystemPrompt } from '../../utils/system-prompt';
import type { GenerationRequest, GenerationResponse } from './generation.types';

/**
 * Generation service.
 *
 * Responsible for:
 * 1. Receiving validated input
 * 2. Building the system prompt (incorporating selected integrations)
 * 3. Calling the AI provider
 * 4. Returning the generated response
 *
 * Does NOT handle HTTP concerns — that belongs to the controller.
 */
export async function generateResponse(
  request: GenerationRequest
): Promise<GenerationResponse> {
  const { prompt, integrations } = request;

  const systemPrompt = buildSystemPrompt(integrations);

  const responseText = await generateFromAI({
    systemPrompt,
    userMessage: prompt,
  });

  return { response: responseText };
}
