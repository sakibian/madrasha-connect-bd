-- Competitions System for Madrasa Platform
-- Allows admins to create competitions and users to register

create table public.competitions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  prize text not null,
  deadline date not null,
  category text not null check (category in ('Quranic', 'Calligraphy', 'Writing', 'Hifz', 'Other')),
  max_participants int,
  registration_open boolean default true,
  image_url text,
  requirements text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.competition_registrations (
  id uuid primary key default uuid_generate_v4(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  submission_url text,
  submission_notes text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'winner')),
  submitted_at timestamptz default now(),
  unique(competition_id, user_id)
);

create index idx_competitions_deadline on public.competitions(deadline);
create index idx_competitions_open on public.competitions(registration_open);
create index idx_registrations_status on public.competition_registrations(status);

alter table public.competitions enable row level security;
alter table public.competition_registrations enable row level security;

-- Anyone can read active competitions
create policy "Anyone can read active competitions"
  on public.competitions for select
  using (registration_open = true);

-- Admins can manage competitions
create policy "Admins can insert competitions"
  on public.competitions for insert
  with check (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "Admins can update competitions"
  on public.competitions for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

-- Users can read own registrations
create policy "Users can read own registrations"
  on public.competition_registrations for select
  using (auth.uid() = user_id);

-- Users can register for competitions
create policy "Users can register"
  on public.competition_registrations for insert
  with check (auth.uid() = user_id);

-- Users can update own registrations
create policy "Users can update own registrations"
  on public.competition_registrations for update
  using (auth.uid() = user_id and status = 'pending');

-- Admins can read all registrations
create policy "Admins can read all registrations"
  on public.competition_registrations for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

-- Admins can update registration status
create policy "Admins can update registration status"
  on public.competition_registrations for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );
