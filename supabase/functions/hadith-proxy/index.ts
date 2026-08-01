// ---------------------------------------------------------------------------
// hadith-proxy Edge Function — Sunnah.com
//
// Requires SUNNAH_API_KEY (free — request at https://sunnah.com/developers).
// Never send this key to the browser.
// ---------------------------------------------------------------------------

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.0';

const UPSTREAM = 'https://api.sunnah.com/v1';
const SOURCE = 'sunnah-com';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SUNNAH_API_KEY       = Deno.env.get('SUNNAH_API_KEY') || '';

const admin = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  if (!SUNNAH_API_KEY) {
    return json({
      error: 'SUNNAH_API_KEY not configured — request a free key from https://sunnah.com/developers and run `supabase secrets set SUNNAH_API_KEY=...`',
    }, 503);
  }

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
    const res = await fetch(url.toString(), {
      headers: { 'X-API-Key': SUNNAH_API_KEY, Accept: 'application/json' },
    });
    if (!res.ok) return json({ error: `upstream HTTP ${res.status}` }, res.status);
    const upstream = await res.json();

    if (admin) {
      // Hadith content is immutable — long TTL.
      const ttl = 30 * 24 * 60 * 60;
      const jitter = Math.floor(ttl * 0.1 * (Math.random() - 0.5));
      await admin.from('content_cache').upsert(
        {
          key,
          value: upstream,
          source: SOURCE,
          fetched_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + (ttl + jitter) * 1000).toISOString(),
        },
        { onConflict: 'key' },
      );
    }

    return json({ data: upstream, cached: false });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
});

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
