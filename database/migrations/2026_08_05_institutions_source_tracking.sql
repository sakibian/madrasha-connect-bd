-- ---------------------------------------------------------------------------
-- Migration: institutions_source_tracking
-- Date: 2026-08-05
-- Idempotent. Safe to re-run.
--
-- Adds provenance columns so every bootstrapped institution row can be
-- traced back to its authoritative public source (BMEB / Befaq / IFB /
-- Banbeis) and re-verified periodically.
-- ---------------------------------------------------------------------------

alter table public.institutions
  add column if not exists source_name         text,
  add column if not exists source_url          text,
  add column if not exists source_verified_at  timestamptz,
  add column if not exists district            text,
  add column if not exists division            text;

create index if not exists idx_institutions_source
  on public.institutions(source_name);
create index if not exists idx_institutions_district
  on public.institutions(district);
create index if not exists idx_institutions_division
  on public.institutions(division);

comment on column public.institutions.source_name is
  'One of: BMEB, Befaq, IFB, Banbeis, Wifaq, community-submitted, ...';
comment on column public.institutions.source_url is
  'Direct URL to the authoritative page for this institution (for one-click re-verification).';

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
