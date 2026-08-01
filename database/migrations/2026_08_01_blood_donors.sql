-- Blood Donor System for Madrasa Community
-- Allows users to register as blood donors and search by blood group + location

create table public.blood_donors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  location text not null,
  district text not null,
  phone text not null,
  last_donation_date date,
  available boolean default true,
  public_profile boolean default true, -- can others see you in search?
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id) -- one donor record per user
);

create index idx_blood_donors_blood_group on public.blood_donors(blood_group);
create index idx_blood_donors_district on public.blood_donors(district);
create index idx_blood_donors_available on public.blood_donors(available);

alter table public.blood_donors enable row level security;

-- Users can read public donor profiles
create policy "Public donors visible to all"
  on public.blood_donors for select
  using (public_profile = true and available = true);

-- Users can read own donor profile (even if private)
create policy "Users can read own donor profile"
  on public.blood_donors for select
  using (auth.uid() = user_id);

-- Users can create own donor profile
create policy "Users can create donor profile"
  on public.blood_donors for insert
  with check (auth.uid() = user_id);

-- Users can update own donor profile
create policy "Users can update own donor profile"
  on public.blood_donors for update
  using (auth.uid() = user_id);

-- Users can delete own donor profile
create policy "Users can delete own donor profile"
  on public.blood_donors for delete
  using (auth.uid() = user_id);

-- View: Active donors with user profile info
create or replace view public.blood_donors_view as
select 
  bd.id,
  bd.user_id,
  up.name,
  up.avatar_url,
  bd.blood_group,
  bd.location,
  bd.district,
  bd.phone,
  bd.last_donation_date,
  bd.available,
  bd.created_at
from public.blood_donors bd
join public.user_profiles up on up.id = bd.user_id
where bd.public_profile = true and bd.available = true;

-- Grant select on view to authenticated users
grant select on public.blood_donors_view to authenticated;
