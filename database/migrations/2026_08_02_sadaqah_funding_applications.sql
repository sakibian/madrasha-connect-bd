-- Sadaqah Funding Applications
-- Allows institutions to apply for sadaqah funding

create table public.sadaqah_funding_applications (
  id uuid primary key default uuid_generate_v4(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  project_title text not null,
  category text not null check (category in ('Infrastructure', 'Food', 'Books', 'Emergency', 'Scholarships', 'Utilities')),
  amount_requested numeric(12,2) not null,
  description text not null,
  justification text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create index idx_funding_apps_status on public.sadaqah_funding_applications(status);
create index idx_funding_apps_institution on public.sadaqah_funding_applications(institution_id);

alter table public.sadaqah_funding_applications enable row level security;

-- Institutions can read own applications
create policy "Institutions can read own applications"
  on public.sadaqah_funding_applications for select
  using (
    auth.uid() = applicant_id or
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

-- Institutions can create applications
create policy "Institutions can create applications"
  on public.sadaqah_funding_applications for insert
  with check (
    auth.uid() = applicant_id and
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'INSTITUTION'
    )
  );

-- Admins can update applications
create policy "Admins can update applications"
  on public.sadaqah_funding_applications for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );
