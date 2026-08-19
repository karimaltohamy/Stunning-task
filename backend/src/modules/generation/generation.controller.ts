import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { GenerationRequestSchema } from './generation.schema';
import { generateResponse } from './generation.service';
import type { GenerationResponse, GenerationErrorResponse } from './generation.types';

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
      const message = err instanceof Error ? err.message : String(err);

      // Log internally but never expose raw errors to the client
      fastify.log.error({ err, message }, 'Generation failed');

      if (message.includes('timed out')) {
        return reply.status(504).send({
          error: 'The AI is taking too long to respond. Please try again.',
        });
      }

      return reply.status(500).send({
        error: 'Something went wrong while generating your response. Please try again.',
      });
    }
  });
}
