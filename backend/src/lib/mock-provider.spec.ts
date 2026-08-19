import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockAIProvider } from './mock-provider';
import type { AIProviderInput, IntegrationId } from '../modules/generation/generation.types';

function makeInput(
  prompt: string,
  integrations: IntegrationId[]
): AIProviderInput {
  return {
    prompt,
    integrations,
    systemPrompt: '',
  };
}

describe('MockAIProvider', () => {
  const provider = new MockAIProvider();

  it('returns a valid GenerationData structure', async () => {
    const result = await provider.generate(
      makeInput('Build a task management app', [])
    );

    assert.equal(typeof result.title, 'string');
    assert.equal(typeof result.summary, 'string');
    assert.equal(Array.isArray(result.features), true);
    assert.equal(Array.isArray(result.integrations), true);
    assert.equal(Array.isArray(result.suggestedStack), true);
    assert.equal(typeof result.architecture, 'string');
  });

  it('derives the title from the prompt', async () => {
    const result = await provider.generate(
      makeInput('Build a restaurant ordering application', [])
    );

    assert.match(result.title, /restaurant ordering/i);
  });

  it('includes selected integrations in the response', async () => {
    const result = await provider.generate(
      makeInput('Build a restaurant ordering dashboard', ['stripe', 'slack'])
    );

    assert.equal(result.integrations.length, 2);
    const names = result.integrations.map((i: { name: string }) => i.name);
    assert.ok(names.includes('Stripe'));
    assert.ok(names.includes('Slack'));

    for (const integration of result.integrations) {
      assert.equal(typeof integration.name, 'string');
      assert.equal(typeof integration.purpose, 'string');
      assert.ok(integration.purpose.length > 10, 'purpose should be descriptive');
    }
  });

  it('returns empty integrations array when none are selected', async () => {
    const result = await provider.generate(
      makeInput('Build a simple todo app', [])
    );

    assert.equal(result.integrations.length, 0);
    assert.match(result.summary, /no external integrations/i);
    assert.match(result.architecture, /no external integrations were selected/i);
  });

  it('generates features dynamically based on prompt keywords', async () => {
    const result = await provider.generate(
      makeInput('Build an e-commerce shop with order tracking', [])
    );

    assert.ok(result.features.length >= 3, 'should have multiple features');
    const allFeatures = result.features.join(' ').toLowerCase();
    assert.ok(
      allFeatures.includes('catalog') || allFeatures.includes('order') || allFeatures.includes('checkout'),
      'features should be relevant to the prompt'
    );
  });

  it('includes integration tech in suggested stack', async () => {
    const result = await provider.generate(
      makeInput('Build a dashboard', ['google-sheets'])
    );

    const stackJoined = result.suggestedStack.join(' ').toLowerCase();
    assert.ok(stackJoined.includes('google sheets'), 'stack should reference Google Sheets');
  });

  it('provides a detailed architecture description', async () => {
    const result = await provider.generate(
      makeInput('Build a chat application', ['gmail'])
    );

    assert.ok(result.architecture.length > 100, 'architecture should be detailed');
    assert.ok(result.architecture.includes('Gmail'), 'architecture should mention the integration');
  });
});
