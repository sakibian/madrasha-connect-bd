// ---------------------------------------------------------------------------
// prayer-proxy Edge Function — Aladhan (prayer times + qibla)
// Mirrors quran-proxy structure; different upstream + default TTLs.
// ---------------------------------------------------------------------------

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.0';

const UPSTREAM = 'https://api.aladhan.com/v1';
const SOURCE = 'aladhan';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const admin = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { endpoint?: string; params?: Record<string, string | number> };
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }

  const endpoint = String(body.endpoint || '').replace(/^\/+/, '');
  if (!endpoint) return json({ error: 'endpoint required' }, 400);

  const key = buildKey(endpoint, body.params);

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
  // Qibla direction from lat/lon is immutable.
  if (endpoint.startsWith('qibla/')) return 365 * 24 * 60 * 60; // 1y
  // Prayer timings change daily — cache for 24h.
  return 24 * 60 * 60;
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
