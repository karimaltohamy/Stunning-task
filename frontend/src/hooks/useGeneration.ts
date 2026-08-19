import { useState, useCallback } from 'react';
import { generateResponse } from '../services/generation.service';
import type { IntegrationId, GenerationData } from '../types';

interface UseGenerationReturn {
  isLoading: boolean;
  data: GenerationData | null;
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
  const [data, setData] = useState<GenerationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string, integrations: IntegrationId[]) => {
    // Prevent duplicate submissions
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateResponse({ prompt, integrations });
      setData(result.data);
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
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { isLoading, data, error, generate, reset };
}
