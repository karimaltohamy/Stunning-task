import { useState, useCallback } from 'react';
import { generateResponse } from '../services/generation.service';
import type { IntegrationId } from '../types';

interface UseGenerationReturn {
  isLoading: boolean;
  response: string | null;
  error: string | null;
  generate: (prompt: string, integrations: IntegrationId[]) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook encapsulating the generation request lifecycle.
 * Prevents duplicate submissions while a request is in flight.
 */
export function useGeneration(): UseGenerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string, integrations: IntegrationId[]) => {
    // Prevent duplicate submissions
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await generateResponse({ prompt, integrations });
      setResponse(result.response);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong while generating your response. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { isLoading, response, error, generate, reset };
}
