import 'dotenv/config';
import { buildApp } from './app';
import { config, validateConfig } from './config/env';

/**
 * Server entry point.
 * Validates environment, builds the app, and starts listening.
 */
async function start(): Promise<void> {
  try {
    // Fail fast if required config is missing
    validateConfig();

    const app = await buildApp();

    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server running at http://localhost:${config.port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
