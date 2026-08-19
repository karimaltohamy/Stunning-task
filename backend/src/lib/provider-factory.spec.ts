import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

function setEnv(key: string, value: string): void {
  process.env[key] = value;
}

function deleteEnv(key: string): void {
  delete process.env[key];
}

describe('Provider Factory', () => {
  beforeEach(() => {
    // Clear require cache for the factory and config so they re-read env
    const factoryPath = require.resolve('./provider-factory');
    const configPath = require.resolve('../config/env');
    delete require.cache[factoryPath];
    delete require.cache[configPath];
    // Also clear the provider modules so their singletons reset
    delete require.cache[require.resolve('./mock-provider')];
    delete require.cache[require.resolve('./ai-provider')];
  });

  it('returns MockAIProvider when AI_PROVIDER is "mock"', () => {
    setEnv('AI_PROVIDER', 'mock');
    deleteEnv('AI_API_KEY');

    const { getAIProvider } = require('./provider-factory');
    const { MockAIProvider } = require('./mock-provider');
    const provider = getAIProvider();

    assert.ok(provider instanceof MockAIProvider);
  });

  it('returns OpenRouterAIProvider when AI_PROVIDER is "openrouter"', () => {
    setEnv('AI_PROVIDER', 'openrouter');
    setEnv('AI_API_KEY', 'sk-or-v1-test-key');

    const { getAIProvider } = require('./provider-factory');
    const { OpenRouterAIProvider } = require('./ai-provider');
    const provider = getAIProvider();

    assert.ok(provider instanceof OpenRouterAIProvider);
  });

  it('defaults to mock when AI_PROVIDER is not set', () => {
    deleteEnv('AI_PROVIDER');
    deleteEnv('AI_API_KEY');

    const { getAIProvider } = require('./provider-factory');
    const { MockAIProvider } = require('./mock-provider');
    const provider = getAIProvider();

    assert.ok(provider instanceof MockAIProvider);
  });
});

describe('Config validation', () => {
  beforeEach(() => {
    const configPath = require.resolve('../config/env');
    delete require.cache[configPath];
  });

  it('throws when AI_PROVIDER is openrouter but AI_API_KEY is missing', () => {
    setEnv('AI_PROVIDER', 'openrouter');
    deleteEnv('AI_API_KEY');

    const { validateConfig } = require('../config/env');

    assert.throws(
      () => validateConfig(),
      /AI_API_KEY.*required/i
    );
  });

  it('does NOT throw when AI_PROVIDER is mock and AI_API_KEY is missing', () => {
    setEnv('AI_PROVIDER', 'mock');
    deleteEnv('AI_API_KEY');

    const { validateConfig } = require('../config/env');

    assert.doesNotThrow(() => validateConfig());
  });

  it('throws on invalid AI_PROVIDER value', () => {
    setEnv('AI_PROVIDER', 'invalid-provider');

    const { validateConfig } = require('../config/env');

    assert.throws(
      () => validateConfig(),
      /AI_PROVIDER.*"openrouter".*"mock"/i
    );
  });
});
