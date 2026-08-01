-- ---------------------------------------------------------------------------
-- Migration: content_cache — shared cache for upstream Islamic content APIs
-- Date: 2026-08-03
-- Idempotent. Safe to re-run.
--
-- All calls to Al-Quran Cloud / Sunnah.com / Aladhan / Islamic Network go
-- through Supabase Edge Functions that first check this table. If we have a
-- non-expired row we return it; otherwise we fetch, insert, and return.
--
-- Design goals:
--   * cheap READS from browser via anon role (RLS: read-only on non-expired rows)
--   * only Edge Functions (service_role) can WRITE
--   * TTL enforced on read (expires_at check)
--   * key format: "<source>:<endpoint>?<params-sorted>"  (e.g. "aladhan:timings?city=Dhaka&country=BD&date=2026-08-01")
-- ---------------------------------------------------------------------------

create table if not exists public.content_cache (
  key         text primary key,
  value       jsonb not null,
  source      text not null,            -- 'alquran-cloud' | 'sunnah-com' | 'aladhan' | 'islamic-network' | ...
  fetched_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_content_cache_source_expires
  on public.content_cache(source, expires_at desc);

-- Housekeeping helper: drop entries older than 60 days regardless of TTL.
create or replace function public.purge_stale_content_cache()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  delete from public.content_cache
  where created_at < now() - interval '60 days';
  get diagnostics n = row_count;
  return n;
end;
$$;

-- RLS -----------------------------------------------------------------------
alter table public.content_cache enable row level security;

-- Anyone (including anon) can READ cache rows that haven't expired yet.
drop policy if exists "Anyone reads fresh cache" on public.content_cache;
create policy "Anyone reads fresh cache"
  on public.content_cache for select
  using (expires_at > now());

-- Only service_role (Edge Functions) may INSERT/UPDATE/DELETE.
-- No policy for insert/update/delete = deny for anon/authenticated.
-- service_role bypasses RLS by default.

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
