-- ---------------------------------------------------------------------------
-- Migration: donations table + admin feedback triage helpers
-- Date: 2026-08-01
-- Idempotent. Safe to re-run.
-- Run with:
--   psql <SUPABASE_DB_URL> -f database/migrations/2026_08_01_donations_and_admin.sql
-- or paste into Supabase Dashboard → SQL Editor.
-- ---------------------------------------------------------------------------

-- 1) DONATIONS TABLE --------------------------------------------------------
-- Every payment attempt (bKash / Nagad / Rocket / Stripe / bank) lands here.
-- We store the FULL lifecycle: initiated -> pending -> completed / failed
-- / refunded, so the admin can reconcile against provider dashboards.

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,       -- null = anon donor
  project_id uuid references public.sadaqah_projects(id) on delete set null,

  -- amount in the smallest unit of the currency (paisa for BDT, cents for USD)
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'BDT' check (currency in ('BDT', 'USD', 'GBP', 'EUR', 'SAR', 'AED')),

  -- Provider bookkeeping
  provider text not null check (provider in ('bkash', 'nagad', 'rocket', 'stripe', 'bank', 'manual')),
  provider_payment_id text,          -- provider's transaction / paymentID
  provider_ref text,                 -- our merchantInvoiceNumber / metadata
  provider_response jsonb,           -- full provider response for audit

  -- Lifecycle
  status text not null default 'initiated' check (
    status in ('initiated', 'pending', 'completed', 'failed', 'refunded')
  ),
  failure_reason text,

  -- Donor contact (optional, for anon donations)
  donor_name text,
  donor_email text,
  donor_phone text,
  message text,                       -- optional public dedication ("for my father")

  -- Anti-abuse
  ip_addr text,
  user_agent text,

  -- Receipts
  receipt_url text,
  receipt_sent_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_donations_user      on public.donations(user_id);
create index if not exists idx_donations_project   on public.donations(project_id);
create index if not exists idx_donations_status    on public.donations(status, created_at desc);
create index if not exists idx_donations_provider  on public.donations(provider, provider_payment_id);

-- RLS -----------------------------------------------------------------------
alter table public.donations enable row level security;

-- Anyone (including anon) can INITIATE a donation. The Edge Function is
-- responsible for validating and transitioning to 'pending'.
drop policy if exists "Anyone can initiate a donation" on public.donations;
create policy "Anyone can initiate a donation"
  on public.donations for insert
  with check (status = 'initiated');

-- A user can read their own donation history.
drop policy if exists "Users read own donations" on public.donations;
create policy "Users read own donations"
  on public.donations for select
  using (auth.uid() = user_id);

-- Admins see everything, including anonymous donations (needed for reconciliation).
drop policy if exists "Admins read all donations" on public.donations;
create policy "Admins read all donations"
  on public.donations for select
  using (public.get_user_role(auth.uid()) = 'ADMIN');

drop policy if exists "Admins update donations" on public.donations;
create policy "Admins update donations"
  on public.donations for update
  using (public.get_user_role(auth.uid()) = 'ADMIN');

-- 2) DONATION TOTALS ROLL-UP ------------------------------------------------
-- Keep sadaqah_projects.raised updated as donations complete. A trigger is
-- simpler and safer than doing this in application code (avoids races).

create or replace function public.on_donation_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only when a donation transitions INTO 'completed' AND has a project.
  if (new.status = 'completed'
      and (tg_op = 'INSERT' or old.status is distinct from 'completed')
      and new.project_id is not null) then
    update public.sadaqah_projects
      set raised = coalesce(raised, 0) + (new.amount_minor / 100)  -- store BDT taka in projects.raised
    where id = new.project_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_donation_completed on public.donations;
create trigger trg_donation_completed
  after insert or update of status on public.donations
  for each row execute function public.on_donation_completed();

-- 3) ADMIN FEEDBACK HELPERS --------------------------------------------------
-- Ensure the feedback table (from previous migration) has the columns the
-- Admin Feedback panel expects. Safe to run even if it already does.

alter table public.feedback
  add column if not exists status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  add column if not exists admin_notes text,
  add column if not exists resolved_at timestamptz;

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
