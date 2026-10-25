import { RequirementPayload, ApiSuccess } from '@/types/requirement.types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: unknown
  ) {
    super(`API error ${status}`);
    this.name = 'ApiError';
  }
}

export async function submitRequirement(payload: RequirementPayload): Promise<ApiSuccess> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  // 30-second timeout to handle Render free-tier cold starts gracefully
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${baseUrl}/api/requirements`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(res.status, body.errors ?? body.message ?? 'Submission failed');
    }

    return body as ApiSuccess;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        'The server is starting up. Please wait a moment and try again.'
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchRequirements(): Promise<any[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/api/requirements`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to load requirements');
  }
  const body = await res.json();
  return body.data || [];
}
