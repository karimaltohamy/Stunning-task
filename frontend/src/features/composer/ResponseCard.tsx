import { useState } from 'react';
import { getIntegrationName } from '../../lib/integrations';
import type { IntegrationId, GenerationData } from '../../types';

interface ResponseCardProps {
  prompt: string;
  integrations: IntegrationId[];
  data: GenerationData;
  isMockMode: boolean;
  onEditPrompt: () => void;
}

/**
 * ResponseCard — the AI-generated response display.
 *
 * Renders structured GenerationData:
 * - Original input recap (muted, collapsible)
 * - Project title + summary
 * - Features list
 * - Integration plans
 * - Suggested tech stack
 * - Architecture description
 * - Copy and Edit Prompt actions
 * - Demo mode indicator (when mock provider is active)
 *
 * Design preserved from source HTML (generated plan page).
 */
export function ResponseCard({
  prompt,
  integrations,
  data,
  isMockMode,
  onEditPrompt,
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = JSON.stringify(data, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-xl">
      {/* Original Input (muted recap) */}
      <div className="flex flex-col gap-sm opacity-60 hover:opacity-100 transition-opacity duration-300">
        <p className="font-label-mono text-label-mono text-text-muted mb-xs uppercase tracking-widest">
          Original Input
        </p>
        <div className="bg-surface border border-border-subtle rounded-lg p-md text-text-muted font-body-md text-body-md">
          "{prompt}"
        </div>
        {integrations.length > 0 && (
          <div className="flex gap-sm mt-sm flex-wrap">
            {integrations.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-surface-container-high border border-border-subtle text-text-muted font-label-mono text-label-mono text-[11px]"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  integration_instructions
                </span>
                {getIntegrationName(id)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Generation Response Card */}
      <div className="w-full glass-panel rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        {/* Premium orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-container via-secondary to-primary-container opacity-80" />

        <div className="p-xl flex flex-col gap-lg">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border-subtle pb-md">
            <div className="flex-1">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-sm">
                {data.title}
              </h1>
              <p className="font-body-md text-body-md text-text-muted">
                {data.summary}
              </p>
              {isMockMode && (
                <div className="inline-flex items-center gap-xs mt-sm px-sm py-xs rounded-full bg-glow-orange border border-primary/20 text-primary-container font-label-mono text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    science
                  </span>
                  Demo AI Mode
                </div>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-glow-orange flex items-center justify-center border border-primary/30 shrink-0 ml-4">
              <span
                className="material-symbols-outlined text-primary-container text-2xl"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: '24px' }}
              >
                check_circle
              </span>
            </div>
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div className="flex flex-col gap-sm">
              <h2 className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">
                Key Features
              </h2>
              <ul className="ai-response-content">
                {data.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Integrations */}
          {data.integrations.length > 0 && (
            <div className="flex flex-col gap-sm">
              <h2 className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">
                Integrations
              </h2>
              <div className="flex flex-col gap-sm">
                {data.integrations.map((integration, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-sm bg-surface border border-border-subtle rounded-lg p-md"
                  >
                    <span
                      className="material-symbols-outlined text-primary-container shrink-0"
                      style={{ fontSize: '18px' }}
                    >
                      extension
                    </span>
                    <div>
                      <p className="font-label-mono text-label-mono text-text-primary uppercase tracking-wider mb-xs">
                        {integration.name}
                      </p>
                      <p className="font-body-md text-body-md text-text-muted">
                        {integration.purpose}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.integrations.length === 0 && (
            <div className="flex items-center gap-sm text-text-muted font-body-md text-body-md">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                info
              </span>
              No external integrations were selected for this project.
            </div>
          )}

          {/* Suggested Stack */}
          {data.suggestedStack.length > 0 && (
            <div className="flex flex-col gap-sm">
              <h2 className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">
                Suggested Stack
              </h2>
              <div className="flex flex-wrap gap-sm">
                {data.suggestedStack.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-xs px-sm py-xs rounded bg-surface-container-high border border-border-subtle text-text-primary font-label-mono text-[11px]"
                  >
                    <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '12px' }}>
                      memory
                    </span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Architecture */}
          {data.architecture && (
            <div className="flex flex-col gap-sm">
              <h2 className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">
                Architecture
              </h2>
              <div className="ai-response-content">
                {data.architecture.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-md pt-md border-t border-border-subtle mt-sm">
            <button
              id="copy-response-button"
              onClick={handleCopy}
              className="w-full sm:w-auto px-lg py-sm font-label-mono text-label-mono text-primary hover:text-primary-container transition-colors flex items-center justify-center gap-xs"
              aria-label="Copy response to clipboard"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied!' : 'Copy Response'}
            </button>
            <button
              id="edit-prompt-button"
              onClick={onEditPrompt}
              className="w-full sm:w-auto px-lg py-sm font-label-mono text-label-mono text-primary hover:text-primary-container transition-colors flex items-center justify-center gap-xs"
              aria-label="Edit prompt"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                edit
              </span>
              Edit Prompt
            </button>
            <button
              className="w-full sm:w-auto bg-primary-container text-black font-label-mono text-label-mono px-xl py-sm rounded-DEFAULT glow-hover transition-all duration-300 flex items-center justify-center gap-sm"
              aria-label="Start building"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                build
              </span>
              Start Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
