import { useState } from 'react';
import { IntegrationChip } from '../../components/IntegrationChip';
import { INTEGRATIONS } from '../../lib/integrations';
import type { IntegrationId } from '../../types';

const MAX_PROMPT_LENGTH = 2000;

interface ComposerCardProps {
  selectedIntegrations: IntegrationId[];
  onToggleIntegration: (id: IntegrationId) => void;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

/**
 * ComposerCard — the main input card on the landing page.
 *
 * Contains:
 * - system.prompt terminal-style textarea
 * - Character counter
 * - Integration chip selector
 * - Initialize Build button
 *
 * Design preserved exactly from source HTML.
 */
export function ComposerCard({
  selectedIntegrations,
  onToggleIntegration,
  onGenerate,
  isLoading,
}: ComposerCardProps) {
  const [prompt, setPrompt] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_PROMPT_LENGTH;

  function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setValidationError('Please describe what you want to build.');
      return;
    }
    if (isOverLimit) {
      setValidationError(`Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`);
      return;
    }
    setValidationError(null);
    onGenerate(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  }

  return (
    <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 md:p-8 relative z-20 border border-border-subtle">
      {/* Context & Input Area */}
      <div className={`ai-input flex flex-col gap-4 mb-8 bg-[#0a0a0a] border rounded-xl p-4 transition-all duration-300 ${validationError ? 'border-error/70' : 'border-border-subtle'}`}>
        {/* Terminal header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            <span className="font-label-mono text-label-mono text-text-muted">system.prompt</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-border-subtle" />
            <div className="w-3 h-3 rounded-full bg-border-subtle" />
            <div className="w-3 h-3 rounded-full bg-border-subtle" />
          </div>
        </div>

        {/* Textarea */}
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (validationError) setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe what you want to build... (e.g., 'A Shopify integrated dashboard that syncs orders to Google Sheets and sends Slack notifications')"
          className="w-full bg-transparent border-none text-text-primary placeholder-text-muted resize-none focus:ring-0 font-body-md text-body-md h-32 outline-none disabled:opacity-50"
          maxLength={MAX_PROMPT_LENGTH + 1}
          aria-label="Prompt input"
          aria-describedby="char-counter"
        />

        {/* Footer row */}
        <div className="flex justify-between items-center mt-2">
          <span
            id="char-counter"
            className={`font-label-mono text-[11px] tracking-wider uppercase ${isOverLimit ? 'text-error' : 'text-text-muted'}`}
          >
            {charCount} / {MAX_PROMPT_LENGTH} chars
          </span>
          <button
            type="button"
            className="text-primary-container hover:text-primary transition-colors flex items-center gap-1"
            aria-label="Enhance prompt"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              auto_awesome
            </span>
            <span className="font-label-mono text-[11px] uppercase tracking-wider">Enhance Prompt</span>
          </button>
        </div>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="flex items-center gap-2 mb-4 text-error font-label-mono text-label-mono" role="alert">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            error
          </span>
          {validationError}
        </div>
      )}

      {/* Integrations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">
            Connected Services
          </h3>
          <button className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add New
          </button>
        </div>
        <div className="flex flex-wrap gap-3" role="group" aria-label="Integration selection">
          {INTEGRATIONS.map((integration) => (
            <IntegrationChip
              key={integration.id}
              integration={integration}
              isSelected={selectedIntegrations.includes(integration.id)}
              onToggle={onToggleIntegration}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Generate Action */}
      <div className="flex justify-end pt-4 border-t border-border-subtle">
        <button
          id="generate-button"
          onClick={handleGenerate}
          disabled={isLoading || isOverLimit}
          className="relative group overflow-hidden px-8 py-3 bg-primary-container text-black font-label-mono text-label-mono rounded hover:bg-secondary-container transition-colors shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          aria-label={isLoading ? 'Generating...' : 'Initialize Build'}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin text-sm"
                  style={{ fontSize: '16px' }}
                >
                  progress_activity
                </span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>
                  bolt
                </span>
                Initialize Build
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
