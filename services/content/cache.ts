/**
 * Read-through cache helper for the content-integration layer.
 *
 * The browser NEVER writes to the cache directly (RLS blocks it). Reads go
 * through Supabase using the anon role — the RLS policy only exposes rows
 * where `expires_at > now()`.
 *
 * Writes happen server-side in Edge Functions (see `supabase/functions/*-proxy`).
 * The helper here is intentionally split so:
 *   - `readCache(key)` — safe from anywhere (browser or edge).
 *   - `writeCache(key, ...)` — expects the caller to be using a service_role
 *     client (Edge Function only). We defensively check that too.
 */

import { supabase } from '../supabase';
import type { ContentSource } from './errors';

export interface CachedRow<T> {
  key: string;
  value: T;
  source: ContentSource;
  fetched_at: string;
  expires_at: string;
}

/**
 * Deterministic cache-key builder.
 * Sorts params so `?a=1&b=2` and `?b=2&a=1` hit the same row.
 */
export function cacheKey(source: ContentSource, endpoint: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return `${source}:${endpoint}`;
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => [k, String(v)] as const)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return parts ? `${source}:${endpoint}?${parts}` : `${source}:${endpoint}`;
}

/**
 * Read a fresh cache row. Returns null if missing or expired.
 * Never throws — cache misses are normal.
 */
export async function readCache<T>(key: string): Promise<CachedRow<T> | null> {
  try {
    const { data, error } = await supabase
      .from('content_cache')
      .select('key, value, source, fetched_at, expires_at')
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return null;
    // RLS already filters expired rows, but double-check for clock skew.
    if (new Date(data.expires_at).getTime() <= Date.now()) return null;
    return data as CachedRow<T>;
  } catch {
    return null;
  }
}

/**
 * Write a cache row. Expects a client authenticated with service_role
 * (i.e. called from an Edge Function). Silently no-ops on failure — cache
 * writes are best-effort.
 */
export async function writeCache<T>(
  client: typeof supabase,
  key: string,
  value: T,
  source: ContentSource,
  ttlSeconds: number,
): Promise<void> {
  try {
    const now = Date.now();
    // 10% jitter to avoid thundering-herd on refresh.
    const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() - 0.5));
    const expiresAt = new Date(now + (ttlSeconds + jitter) * 1000).toISOString();
    await client.from('content_cache').upsert(
      {
        key,
        value: value as unknown as object,
        source,
        fetched_at: new Date(now).toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: 'key' },
    );
  } catch {
    /* ignore */
  }
}
