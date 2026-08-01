// ---------------------------------------------------------------------------
// quran-proxy Edge Function
//
// Proxies requests to Al-Quran Cloud (https://api.alquran.cloud/v1) with
// a Supabase-backed cache. Free upstream, no auth required, CORS-open.
// We proxy anyway so we can:
//   1. Cache aggressively (default 24h TTL, longer for immutable data).
//   2. Add a single point for rate-limit backoff if we ever need it.
//   3. Keep the browser off cross-origin traffic (better CSP hygiene).
//
// Request body:
//   { endpoint: string, params?: Record<string, string|number> }
//
// Response body:
//   { data: unknown } on success, { error: string } on failure.
// ---------------------------------------------------------------------------

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.0';

const UPSTREAM = 'https://api.alquran.cloud/v1';
const SOURCE = 'alquran-cloud';
const DEFAULT_TTL = 24 * 60 * 60; // 24h

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const admin = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { endpoint?: string; params?: Record<string, string | number> };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const endpoint = String(body.endpoint || '').replace(/^\/+/, '');
  if (!endpoint) return json({ error: 'endpoint required' }, 400);

  const key = buildKey(endpoint, body.params);

  // 1. Check cache.
  if (admin) {
    const { data: row } = await admin
      .from('content_cache')
      .select('value, expires_at')
      .eq('key', key)
      .maybeSingle();
    if (row && new Date(row.expires_at).getTime() > Date.now()) {
      return json({ data: row.value, cached: true });
    }
  }

  // 2. Fetch upstream.
  const url = new URL(`${UPSTREAM}/${endpoint}`);
  for (const [k, v] of Object.entries(body.params || {})) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return json({ error: `upstream HTTP ${res.status}` }, 502);
    const upstream = await res.json();
    if (upstream?.code !== 200 || upstream?.data === undefined) {
      return json({ error: upstream?.status || 'malformed upstream response' }, 502);
    }

    // 3. Persist to cache (best effort).
    if (admin) {
      const ttl = pickTtl(endpoint);
      const jitter = Math.floor(ttl * 0.1 * (Math.random() - 0.5));
      await admin.from('content_cache').upsert(
        {
          key,
          value: upstream.data,
          source: SOURCE,
          fetched_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + (ttl + jitter) * 1000).toISOString(),
        },
        { onConflict: 'key' },
      );
    }

    return json({ data: upstream.data, cached: false });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
});

function pickTtl(endpoint: string): number {
  // Immutable data (surah list, individual ayat, complete surahs) never change.
  if (/^(surah|ayah|edition)/i.test(endpoint)) return 30 * 24 * 60 * 60; // 30d
  return DEFAULT_TTL;
}

function buildKey(endpoint: string, params?: Record<string, unknown>): string {
  const sortedParams = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)] as const)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&')
    : '';
  return sortedParams ? `${SOURCE}:${endpoint}?${sortedParams}` : `${SOURCE}:${endpoint}`;
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
