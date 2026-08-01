-- ---------------------------------------------------------------------------
-- Migration: user feedback + phone auth support
-- Date: 2026-08-01
-- Run with:  psql <SUPABASE_DB_URL> -f database/migrations/2026_08_01_feedback_and_phone.sql
-- OR paste into Supabase Dashboard → SQL Editor.
-- Idempotent: safe to re-run.
-- ---------------------------------------------------------------------------

-- 1) FEEDBACK TABLE ----------------------------------------------------------
-- Every submission from the "Give Feedback" widget lands here so admins can
-- triage community signal. Anonymous submissions are ALLOWED (user_id NULL)
-- because we want to hear from visitors who haven't signed up yet.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null check (category in ('bug', 'idea', 'content', 'donation', 'other')),
  message text not null check (char_length(message) between 3 and 4000),
  rating int check (rating between 1 and 5),
  contact text,           -- optional email/phone the user leaves for follow-up
  page_url text,          -- which page they were on when they submitted
  user_agent text,        -- browser / device info for bug triage
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_feedback_status  on public.feedback(status, created_at desc);
create index if not exists idx_feedback_user    on public.feedback(user_id);
create index if not exists idx_feedback_category on public.feedback(category);

alter table public.feedback enable row level security;

-- Anyone (including anon) can create feedback — that's the whole point.
drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

-- Users can read their OWN feedback (to see status updates).
drop policy if exists "Users can read own feedback" on public.feedback;
create policy "Users can read own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

-- Admins can read and update everything.
drop policy if exists "Admins can read all feedback" on public.feedback;
create policy "Admins can read all feedback"
  on public.feedback for select
  using (public.get_user_role(auth.uid()) = 'ADMIN');

drop policy if exists "Admins can update feedback" on public.feedback;
create policy "Admins can update feedback"
  on public.feedback for update
  using (public.get_user_role(auth.uid()) = 'ADMIN');


-- 2) PHONE COLUMN + INDEX ON user_profiles ----------------------------------
-- Ensure the `phone` column exists (the base schema already declares it, but
-- older Supabase projects may not have it yet). We also add a unique index
-- so one phone number == one user profile.

alter table public.user_profiles
  add column if not exists phone text;

create unique index if not exists idx_user_profiles_phone
  on public.user_profiles(phone)
  where phone is not null;


-- 3) TRIGGER TO AUTO-CREATE user_profiles ON PHONE OTP SIGNUP ----------------
-- Supabase inserts a row into auth.users when a new phone signup completes.
-- Our app code also inserts into public.user_profiles, but the trigger acts
-- as a safety net so no auth user ever exists WITHOUT a profile row.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, name, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'ব্যবহারকারী'),
    'USER',
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_handle_new_auth_user on auth.users;
create trigger trg_handle_new_auth_user
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();


-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
