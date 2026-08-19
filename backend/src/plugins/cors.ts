import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { config } from '../config/env';

/**
 * Registers CORS with explicit origin allowlist.
 * Only the configured frontend URL is allowed in production.
 */
export async function registerCors(fastify: FastifyInstance): Promise<void> {
  await fastify.register(cors, {
    origin: config.nodeEnv === 'production' ? config.frontendUrl : true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
}
