import Fastify from 'fastify';
import { registerCors } from './plugins/cors';
import { generationController } from './modules/generation/generation.controller';
import { config } from './config/env';

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

  // Provider status — lets the frontend know if mock mode is active
  fastify.get('/api/status', async () => ({
    provider: config.aiProvider,
  }));

  return fastify;
}
