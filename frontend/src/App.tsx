import { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ComposerCard } from './features/composer/ComposerCard';
import { ResponseCard } from './features/composer/ResponseCard';
import { useGeneration } from './hooks/useGeneration';
import { getProviderStatus } from './services/generation.service';
import type { IntegrationId } from './types';
import './index.css';

/**
 * Root application component.
 *
 * Manages:
 * - prompt (stored here so it persists to the response page)
 * - selectedIntegrations
 * - generation state (via useGeneration hook)
 * - view switching (composer ↔ response)
 * - demo mode indicator (when mock provider is active)
 */
function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<IntegrationId[]>([]);
  const { isLoading, data, error, generate, reset } = useGeneration();
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    getProviderStatus().then((status) => {
      setIsMockMode(status.provider === 'mock');
    });
  }, []);

  const handleToggleIntegration = useCallback((id: IntegrationId) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleGenerate = useCallback(
    (submittedPrompt: string) => {
      setPrompt(submittedPrompt);
      generate(submittedPrompt, selectedIntegrations);
    },
    [selectedIntegrations, generate]
  );

  const handleEditPrompt = useCallback(() => {
    reset();
  }, [reset]);

  const showResponse = data !== null || error !== null;

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-xl px-4 md:px-lg relative z-10 w-full max-w-container-max mx-auto">
        {!showResponse && (
          <>
            {/* Hero glow */}
            <div className="hero-glow" aria-hidden="true" />

            {/* Hero text */}
            <div className="text-center mb-16 relative z-10 max-w-3xl">
              <h1 className="text-5xl md:text-7xl  text-white font-bold tracking-tighter mb-6">
                Build anything with{' '}
                <span className="text-primary-container relative">
                  AI.
                  <span className="absolute inset-0 bg-primary-container blur-2xl opacity-20 -z-10" />
                </span>
              </h1>
              <p className="text-body-lg font-body-lg text-text-muted max-w-xl mx-auto">
                Describe your application in plain text. Our elite engineering models will instantly scaffold, connect, and deploy the infrastructure.
              </p>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="w-full max-w-4xl mb-6 relative z-20" aria-live="polite">
                <div className="glass-panel rounded-2xl p-6 border border-border-subtle">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-glow-orange flex items-center justify-center border border-primary/30">
                      <span
                        className="material-symbols-outlined text-primary-container animate-spin"
                        style={{ fontSize: '20px' }}
                      >
                        progress_activity
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-label-mono text-text-primary uppercase tracking-widest">
                        Generating Architecture
                      </p>
                      <p className="font-body-md text-code-sm text-text-muted mt-1">
                        AI models are analyzing your requirements...
                      </p>
                    </div>
                  </div>
                  {/* Animated progress bar */}
                  <div className="h-[2px] bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-container to-secondary-container animate-pulse"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Composer card */}
            <ComposerCard
              selectedIntegrations={selectedIntegrations}
              onToggleIntegration={handleToggleIntegration}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Error state */}
        {error && (
          <div className="w-full max-w-4xl" aria-live="assertive">
            <div className="glass-panel rounded-xl p-6 border border-error/30">
              <div className="flex items-start gap-4">
                <span
                  className="material-symbols-outlined text-error mt-0.5"
                  style={{ fontSize: '20px' }}
                >
                  error
                </span>
                <div className="flex-1">
                  <p className="font-label-mono text-label-mono text-error uppercase tracking-wider mb-2">
                    Generation Failed
                  </p>
                  <p className="font-body-md text-body-md text-text-muted mb-4">{error}</p>
                  <button
                    id="retry-button"
                    onClick={handleEditPrompt}
                    className="px-lg py-sm bg-primary-container text-black font-label-mono text-label-mono rounded hover:bg-secondary-container transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response state */}
        {data && !error && (
          <ResponseCard
            prompt={prompt}
            integrations={selectedIntegrations}
            data={data}
            isMockMode={isMockMode}
            onEditPrompt={handleEditPrompt}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
