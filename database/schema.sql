-- Madrasa Connect BD — Database Schema
-- Run this in Supabase SQL Editor after creating your project.

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. User Profiles (extends Supabase auth.users)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('USER', 'INSTITUTION', 'SCHOLAR', 'ADMIN')),
  avatar_url text,
  phone text,
  institution_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- 2. Institutions
create table public.institutions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Qawmi', 'Alia', 'Mosque')),
  location text not null,
  district text not null,
  established text,
  description text,
  image_url text,
  student_count int default 0,
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_institutions_district on public.institutions(district);
create index idx_institutions_type on public.institutions(type);
create index idx_institutions_verified on public.institutions(verified);

alter table public.institutions enable row level security;

create policy "Anyone can read verified institutions"
  on public.institutions for select
  using (verified = true or auth.uid() = owner_id);

create policy "Owner can update own institution"
  on public.institutions for update
  using (auth.uid() = owner_id);

-- 3. Jobs
create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  posted_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('Imam', 'Teacher', 'Muazzin', 'Staff')),
  location text not null,
  salary text,
  description text,
  contact_info text,
  status text not null default 'pending' check (status in ('draft', 'pending', 'verified', 'closed', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_jobs_status on public.jobs(status);
create index idx_jobs_type on public.jobs(type);
create index idx_jobs_location on public.jobs(location);
create index idx_jobs_created on public.jobs(created_at desc);

alter table public.jobs enable row level security;

create policy "Anyone can read verified jobs"
  on public.jobs for select
  using (status = 'verified' or auth.uid() = posted_by);

create policy "Institution can post jobs"
  on public.jobs for insert with check (auth.uid() = posted_by);

create policy "Owner can update own jobs"
  on public.jobs for update using (auth.uid() = posted_by);

-- 4. Job Applications
create table public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  cover_note text,
  status text not null default 'pending' check (status in ('pending', 'shortlisted', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique(job_id, applicant_id)
);

alter table public.job_applications enable row level security;

create policy "Users can read own applications"
  on public.job_applications for select
  using (auth.uid() = applicant_id);

create policy "Institution can read applications for their jobs"
  on public.job_applications for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = job_applications.job_id
      and jobs.posted_by = auth.uid()
    )
  );

create policy "Users can create applications"
  on public.job_applications for insert with check (auth.uid() = applicant_id);

-- 5. Scholars
create table public.scholars (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  title text not null,
  specialization text not null,
  institution text,
  location text,
  bio text,
  image_url text,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.scholars enable row level security;

create policy "Anyone can read verified scholars"
  on public.scholars for select
  using (verified = true or auth.uid() = user_id);

-- 6. Fatwas
create table public.fatwas (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  category text not null check (category in ('Ibadah', 'Muamalah', 'Family', 'Social', 'Other')),
  asked_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'answered', 'rejected')),
  ai_suggestion text,
  created_at timestamptz default now()
);

create index idx_fatwas_status on public.fatwas(status);
create index idx_fatwas_category on public.fatwas(category);

alter table public.fatwas enable row level security;

create policy "Anyone can read answered fatwas"
  on public.fatwas for select
  using (status = 'answered' or auth.uid() = asked_by);

create policy "Users can submit fatwas"
  on public.fatwas for insert with check (auth.uid() = asked_by);

-- 7. Fatwa Answers
create table public.fatwa_answers (
  id uuid primary key default uuid_generate_v4(),
  fatwa_id uuid not null references public.fatwas(id) on delete cascade unique,
  answer text not null,
  answered_by uuid not null references auth.users(id) on delete cascade,
  sources jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.fatwa_answers enable row level security;

create policy "Anyone can read answers"
  on public.fatwa_answers for select
  using (true);

-- 8. Products (Marketplace)
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric(10,2) not null,
  category text not null check (category in ('Calligraphy', 'Sunnah Food', 'Books', 'Modest Fashion')),
  description text,
  image_url text,
  is_free boolean default false,
  is_vector boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can read products"
  on public.products for select using (true);

-- 9. Courses
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  instructor text not null,
  duration text,
  category text not null check (category in ('Deen-101', 'Tajweed', 'History')),
  description text,
  thumbnail_url text,
  created_at timestamptz default now()
);

alter table public.courses enable row level security;

create policy "Anyone can read courses"
  on public.courses for select using (true);

-- 10. Enrollments
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  progress int default 0,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(course_id, user_id)
);

alter table public.enrollments enable row level security;

create policy "Users can read own enrollments"
  on public.enrollments for select using (auth.uid() = user_id);

create policy "Users can enroll"
  on public.enrollments for insert with check (auth.uid() = user_id);

-- 11. Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('job', 'community', 'application', 'fatwa', 'system')),
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index idx_notifications_user on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can mark notifications read"
  on public.notifications for update using (auth.uid() = user_id);

-- 12. Forum Posts
create table public.forum_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'General' check (category in ('General', 'Jobs Discussion', 'Education', 'Events', 'Fatwa', 'Other')),
  likes int default 0,
  comments_count int default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Add category column if upgrading from earlier schema
-- ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS category text not null default 'General';

alter table public.forum_posts enable row level security;

create policy "Anyone can read forum posts"
  on public.forum_posts for select using (true);

create policy "Users can create posts"
  on public.forum_posts for insert with check (auth.uid() = author_id);

-- 13. Forum Comments
create table public.forum_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.forum_comments enable row level security;

create policy "Anyone can read comments"
  on public.forum_comments for select using (true);

create policy "Users can create comments"
  on public.forum_comments for insert with check (auth.uid() = author_id);

-- 14. Sadaqah Projects
create table public.sadaqah_projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  institution text,
  category text not null check (category in ('Infrastructure', 'Food', 'Books', 'Emergency')),
  goal numeric(12,2) not null,
  raised numeric(12,2) default 0,
  description text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.sadaqah_projects enable row level security;

create policy "Anyone can read sadaqah projects"
  on public.sadaqah_projects for select using (true);

-- 15. Donations
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.sadaqah_projects(id) on delete cascade,
  donor_id uuid references auth.users(id) on delete set null,
  amount numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table public.donations enable row level security;

create policy "Donors can read own donations"
  on public.donations for select using (auth.uid() = donor_id);

-- 16. Events
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_date date not null,
  location text,
  organizer text,
  type text not null check (type in ('competition', 'seminar', 'workshop', 'other')),
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Anyone can read events"
  on public.events for select using (true);

-- 17. Audit Log
create table public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

alter table public.audit_log enable row level security;

create policy "Admins can read audit log"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'ADMIN'
    )
  );

-- 18. Sources (Knowledge Base Authenticity)
create table public.sources (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('quran', 'hadith', 'scholarly', 'book', 'other')),
  reference text not null,
  text text,
  url text,
  created_at timestamptz default now()
);

create index idx_sources_type on public.sources(type);

alter table public.sources enable row level security;

create policy "Anyone can read sources"
  on public.sources for select using (true);

-- 19. Content Sources (Junction)
create table public.content_sources (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references public.sources(id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  unique(source_id, content_type, content_id)
);

alter table public.content_sources enable row level security;

create policy "Anyone can read content sources"
  on public.content_sources for select using (true);

-- 20. Content Flags (community moderation)
create table public.content_flags (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null,
  content_id text not null,
  flagged_by uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'dismissed', 'resolved')),
  created_at timestamptz default now(),
  unique(content_type, content_id, flagged_by)
);

create index idx_content_flags_status on public.content_flags(status);

alter table public.content_flags enable row level security;

create policy "Users can create flags"
  on public.content_flags for insert with check (auth.uid() = flagged_by);

create policy "Users can read own flags"
  on public.content_flags for select using (auth.uid() = flagged_by or exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN'));

create policy "Admins can update flags"
  on public.content_flags for update using (exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN'));

-- Admin access policies (role-based)
create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN')
  );

create policy "Admins can update all profiles"
  on public.user_profiles for update
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN')
  );

-- 21. Scholar Applications (verification workflow)
create table public.scholar_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  title text not null,
  specialization text not null,
  institution text,
  location text,
  bio text,
  credentials text[] default '{}',
  references text[] default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_scholar_applications_status on public.scholar_applications(status);

alter table public.scholar_applications enable row level security;

create policy "Users can read own applications"
  on public.scholar_applications for select
  using (auth.uid() = user_id);

create policy "Users can create applications"
  on public.scholar_applications for insert with check (auth.uid() = user_id);

create policy "Admins can read all applications"
  on public.scholar_applications for select
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN')
  );

create policy "Admins can update applications"
  on public.scholar_applications for update
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'ADMIN')
  );

-- 22. Content Versions (audit trail for edits)
create table public.content_versions (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null,
  content_id uuid not null,
  title text,
  body text not null,
  changed_by uuid not null references auth.users(id) on delete cascade,
  change_summary text,
  created_at timestamptz default now()
);

create index idx_content_versions_content on public.content_versions(content_type, content_id, created_at desc);

alter table public.content_versions enable row level security;

create policy "Anyone can read content versions"
  on public.content_versions for select using (true);

create policy "Authenticated users can create versions"
  on public.content_versions for insert with check (auth.role() = 'authenticated');

-- 23. User XP & Levels (Gamification)
create table public.user_xp (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  xp integer default 0,
  level integer default 1,
  updated_at timestamptz default now()
);

alter table public.user_xp enable row level security;

create policy "Anyone can read user_xp"
  on public.user_xp for select using (true);

create policy "System can insert user_xp"
  on public.user_xp for insert with check (auth.uid() = user_id);

create policy "System can update own xp"
  on public.user_xp for update using (auth.uid() = user_id);

-- 24. Badge Definitions
create table public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon text,
  xp_required integer default 0
);

alter table public.badges enable row level security;

create policy "Anyone can read badges"
  on public.badges for select using (true);

-- 25. User Badges (earned)
create table public.user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

create index idx_user_badges_user on public.user_badges(user_id);

alter table public.user_badges enable row level security;

create policy "Anyone can read user_badges"
  on public.user_badges for select using (true);

create policy "Users can earn badges"
  on public.user_badges for insert with check (auth.uid() = user_id);

-- 26. XP Events (audit log for XP earning)
create table public.xp_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  xp integer not null,
  created_at timestamptz default now()
);

create index idx_xp_events_user on public.xp_events(user_id, created_at desc);

alter table public.xp_events enable row level security;

create policy "Anyone can read xp_events"
  on public.xp_events for select using (true);

create policy "System can insert xp_events"
  on public.xp_events for insert with check (auth.uid() = user_id);

-- 27. Forum Post Likes (voting)
create table public.forum_post_likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create index idx_forum_post_likes_post on public.forum_post_likes(post_id);
create index idx_forum_post_likes_user on public.forum_post_likes(user_id);

alter table public.forum_post_likes enable row level security;

create policy "Anyone can read likes"
  on public.forum_post_likes for select using (true);

create policy "Users can like"
  on public.forum_post_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.forum_post_likes for delete using (auth.uid() = user_id);
