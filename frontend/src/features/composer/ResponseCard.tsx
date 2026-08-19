import { useState } from 'react';
import { getIntegrationName } from '../../lib/integrations';
import type { IntegrationId } from '../../types';

interface ResponseCardProps {
  prompt: string;
  integrations: IntegrationId[];
  response: string;
  onEditPrompt: () => void;
}

/**
 * Renders the AI response.
 *
 * Converts the markdown-like response text to formatted HTML for display.
 * Uses a simple but effective approach to parse the most common markdown patterns.
 */
function formatResponse(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bullet lists - convert consecutive list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> items in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraph breaks (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph
    .replace(/^(?!<[hup])/m, '<p>')
    + '</p>';
}

/**
 * ResponseCard — the AI-generated response display.
 *
 * Shows:
 * - Original input recap (muted, collapsible)
 * - Generation response with formatted content
 * - Copy and Edit Prompt actions
 *
 * Design preserved exactly from source HTML (generated plan page).
 */
export function ResponseCard({
  prompt,
  integrations,
  response,
  onEditPrompt,
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(response);
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
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-sm">
                Architecture Generated
              </h1>
              <p className="font-body-md text-body-md text-text-muted">
                Your project structure and components are ready to be built.
              </p>
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

          {/* AI Response Content */}
          <div
            className="ai-response-content"
            dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
          />

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
