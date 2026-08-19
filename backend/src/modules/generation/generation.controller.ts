import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { GenerationRequestSchema } from './generation.schema';
import { generateResponse } from './generation.service';
import type { GenerationResponse, GenerationErrorResponse } from './generation.types';

/**
 * Maps provider errors to safe user-facing messages and HTTP status codes.
 * Internal error details are logged but never sent to the client.
 */
function mapProviderError(
  err: unknown,
  fastify: FastifyInstance
): { statusCode: number; message: string } {
  const message = err instanceof Error ? err.message : String(err);

  fastify.log.error({ err, message }, 'Generation failed');

  if (message.includes('timed out')) {
    return {
      statusCode: 504,
      message: 'The AI is taking too long to respond. Please try again.',
    };
  }

  if (message.includes('429') || message.includes('quota') || message.includes('rate limit')) {
    return {
      statusCode: 429,
      message: 'The AI service is busy. Please wait a moment and try again.',
    };
  }

  if (message.includes('401') || message.includes('Authentication') || message.includes('API key')) {
    return {
      statusCode: 503,
      message: 'The AI service is not properly configured. Please contact the administrator.',
    };
  }

  if (message.includes('503') || message.includes('unavailable') || message.includes('unreachable')) {
    return {
      statusCode: 503,
      message: 'The AI service is temporarily unavailable. Please try again shortly.',
    };
  }

  return {
    statusCode: 500,
    message: 'Something went wrong while generating your response. Please try again.',
  };
}

/**
 * Generation controller.
 *
 * Handles HTTP concerns only:
 * - Route registration
 * - Request parsing and validation
 * - Response serialization
 * - Error mapping to HTTP status codes
 *
 * Delegates business logic entirely to the service.
 */
export async function generationController(fastify: FastifyInstance): Promise<void> {
  fastify.post<{
    Body: unknown;
    Reply: GenerationResponse | GenerationErrorResponse;
  }>('/api/generate', async (request, reply) => {
    // Validate request body
    let validatedBody;
    try {
      validatedBody = GenerationRequestSchema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        const firstError = err.errors[0];
        return reply.status(400).send({ error: firstError?.message ?? 'Invalid request.' });
      }
      return reply.status(400).send({ error: 'Invalid request body.' });
    }

    // Delegate to service
    try {
      const result = await generateResponse(validatedBody);
      return reply.status(200).send(result);
    } catch (err) {
      const { statusCode, message } = mapProviderError(err, fastify);
      return reply.status(statusCode).send({ error: message });
    }
  });
}
