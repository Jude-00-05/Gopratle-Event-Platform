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

const LOCAL_API_BASE_URL = 'http://localhost:4000';

export function getRequirementsEndpoint(
  configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL || LOCAL_API_BASE_URL
): string {
  const baseUrl = configuredBaseUrl.trim();
  if (!baseUrl || /^[./\\]/.test(baseUrl)) {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute API host, not a relative path');
  }

  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(baseUrl);
  const isLocalHost = /^(localhost|127(?:\.\d{1,3}){3})(:\d+)?(?:\/|$)/i.test(baseUrl);
  const absoluteBaseUrl = hasScheme
    ? baseUrl
    : `${isLocalHost ? 'http' : 'https'}://${baseUrl}`;

  let parsedBaseUrl: URL;
  try {
    parsedBaseUrl = new URL(absoluteBaseUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be a valid HTTP or HTTPS URL');
  }

  if (parsedBaseUrl.protocol !== 'http:' && parsedBaseUrl.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTP or HTTPS');
  }

  return new URL('/api/requirements', parsedBaseUrl.origin).toString();
}

export async function submitRequirement(payload: RequirementPayload): Promise<ApiSuccess> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  // 30-second timeout to handle Render free-tier cold starts gracefully
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(getRequirementsEndpoint(process.env.NEXT_PUBLIC_API_URL), {
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
  const res = await fetch(getRequirementsEndpoint(), {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to load requirements');
  }
  const body = await res.json();
  return body.data || [];
}
