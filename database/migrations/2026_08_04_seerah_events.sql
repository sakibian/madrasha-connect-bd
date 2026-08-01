-- ---------------------------------------------------------------------------
-- Migration: seerah_events — admin overlay for the built-in Seerah dataset
-- Date: 2026-08-04
-- Idempotent. Safe to re-run.
--
-- The core Seerah timeline ships in-repo (data/seerah/events.ts) so the app
-- works offline. This table lets admins:
--   * add new events without a code deploy
--   * flag / correct existing events (community reports)
--   * translate to future languages
--
-- Read policy: everyone can read.
-- Write policy: only ADMIN role may insert/update.
-- ---------------------------------------------------------------------------

create table if not exists public.seerah_events (
  id                text primary key,
  order_index       integer not null,
  gregorian_year    text not null,
  hijri_year        text,
  approx_age        integer,
  title_bn          text not null,
  title_en          text not null,
  title_ar          text,
  location          text,
  category          text not null check (category in (
    'pre-prophethood', 'revelation', 'makkah-era', 'migration',
    'madinah-era', 'battles', 'family', 'treaty', 'wafat'
  )),
  importance        text not null default 'medium' check (importance in ('high', 'medium')),
  description_bn    text not null,
  description_en    text not null,
  citations         jsonb not null default '[]'::jsonb,
  source            text not null default 'admin',   -- 'admin' | 'community' | 'seed'
  approved_by       uuid references auth.users(id) on delete set null,
  approved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_seerah_events_order
  on public.seerah_events(order_index);
create index if not exists idx_seerah_events_category
  on public.seerah_events(category, order_index);

-- RLS -----------------------------------------------------------------------
alter table public.seerah_events enable row level security;

drop policy if exists "Everyone reads seerah events" on public.seerah_events;
create policy "Everyone reads seerah events"
  on public.seerah_events for select
  using (true);

drop policy if exists "Admins manage seerah events" on public.seerah_events;
create policy "Admins manage seerah events"
  on public.seerah_events for all
  using (public.get_user_role(auth.uid()) = 'ADMIN')
  with check (public.get_user_role(auth.uid()) = 'ADMIN');

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
