import Fastify from 'fastify';
import { registerCors } from './plugins/cors';
import { generationController } from './modules/generation/generation.controller';

/**
 * Creates and configures the Fastify application.
 * Separated from server.ts so it can be tested independently.
 */
export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // Plugins
  await registerCors(fastify);

  // Routes
  await fastify.register(generationController);

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  return fastify;
}
