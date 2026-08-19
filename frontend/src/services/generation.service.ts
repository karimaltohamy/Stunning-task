import type { GenerationRequest, GenerationResponse, GenerationErrorResponse, StatusResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Fetches the current AI provider status from the backend.
 * Used to show a "Demo AI mode" indicator when the mock provider is active.
 */
export async function getProviderStatus(): Promise<StatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status`, {
      signal: AbortSignal.timeout(5_000),
    });
    const data: StatusResponse = await response.json();
    return data;
  } catch {
    // If the status endpoint is unreachable, assume real provider
    return { provider: 'openrouter' };
  }
}

/**
 * Calls the backend generation API.
 *
 * This is the only place in the frontend that knows about HTTP/fetch.
 * UI components should call this service, not fetch() directly.
 *
 * @throws Error with a user-facing message on any failure
 */
export async function generateResponse(
  request: GenerationRequest
): Promise<GenerationResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(65_000), // Slightly longer than backend timeout
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new Error('The request timed out. Please try again.');
    }
    if (err instanceof Error && err.name === 'TypeError') {
      throw new Error('Unable to connect to the server. Please check your connection.');
    }
    throw new Error('Something went wrong. Please try again.');
  }

  const data: GenerationResponse | GenerationErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as GenerationErrorResponse;
    throw new Error(errorData.error ?? 'Something went wrong. Please try again.');
  }

  return data as GenerationResponse;
}
