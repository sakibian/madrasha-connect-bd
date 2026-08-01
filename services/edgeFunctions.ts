/**
 * Centralized helper for calling Supabase Edge Functions.
 *
 * Reads the project URL from VITE_SUPABASE_URL so we never hardcode
 * the Supabase project reference in application code. This means:
 *
 *   1. The same code works across staging / production projects.
 *   2. Rotating the project only requires an env change, not a code push.
 *   3. There is no risk of pointing at a stale Supabase project.
 */

const RAW_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();

/**
 * Derives the Supabase Functions host from the project URL.
 * e.g. https://abcxyz.supabase.co  ->  https://abcxyz.functions.supabase.co
 */
const getFunctionsHost = (): string => {
  if (!RAW_SUPABASE_URL) return '';
  try {
    const url = new URL(RAW_SUPABASE_URL);
    // "abcxyz.supabase.co" -> "abcxyz.functions.supabase.co"
    const host = url.host.replace(/\.supabase\.co$/, '.functions.supabase.co');
    return `${url.protocol}//${host}`;
  } catch {
    console.error('[edgeFunctions] Invalid VITE_SUPABASE_URL:', RAW_SUPABASE_URL);
    return '';
  }
};

const FUNCTIONS_HOST = getFunctionsHost();

/**
 * Build the URL for a named Edge Function.
 * @param name The function slug (e.g. "gemini-proxy", "content-moderation").
 */
export const edgeFunctionUrl = (name: string): string => {
  if (!FUNCTIONS_HOST) {
    console.error(
      `[edgeFunctions] Cannot resolve URL for "${name}" — VITE_SUPABASE_URL is not set.`
    );
    return '';
  }
  return `${FUNCTIONS_HOST}/${name}`;
};

/**
 * Convenience wrapper that POSTs JSON to an Edge Function and returns the
 * parsed body. Returns `null` if the call fails so callers can gracefully
 * degrade to a fallback experience.
 */
export const callEdgeFunction = async <T = unknown>(
  name: string,
  body: unknown,
  init: RequestInit = {}
): Promise<T | null> => {
  const url = edgeFunctionUrl(name);
  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`[edgeFunctions] ${name} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[edgeFunctions] ${name} network error:`, err);
    return null;
  }
};
