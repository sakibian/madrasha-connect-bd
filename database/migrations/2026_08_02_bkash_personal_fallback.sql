-- ---------------------------------------------------------------------------
-- Migration: bKash personal-account fallback
-- Date: 2026-08-02
-- Idempotent. Safe to re-run.
--
-- Adds two new controlled values so the Edge Function can record donations
-- collected against a company-owned *personal* bKash number while the real
-- merchant account is still being approved:
--
--   provider = 'bkash_personal'          (new — distinct from real bkash)
--   status   = 'awaiting_manual_review'  (new — admin will confirm SMS)
--
-- After the merchant account goes live these values still remain valid so
-- old donation rows never break.
-- ---------------------------------------------------------------------------

-- 1) Widen the provider CHECK constraint --------------------------------------
alter table public.donations
  drop constraint if exists donations_provider_check;

alter table public.donations
  add constraint donations_provider_check
  check (provider in ('bkash', 'bkash_personal', 'nagad', 'rocket', 'stripe', 'bank', 'manual'));

-- 2) Widen the status CHECK constraint ----------------------------------------
alter table public.donations
  drop constraint if exists donations_status_check;

alter table public.donations
  add constraint donations_status_check
  check (status in (
    'initiated',
    'pending',
    'awaiting_manual_review',
    'completed',
    'failed',
    'refunded'
  ));

-- 3) Allow admins to update the manual-review status --------------------------
-- (Already covered by existing "Admins update donations" policy — no change.)

-- 4) Optional helper index for the admin reconciliation queue ----------------
create index if not exists idx_donations_manual_review
  on public.donations(status, created_at desc)
  where status = 'awaiting_manual_review';

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
