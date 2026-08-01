-- ---------------------------------------------------------------------------
-- Migration: curriculum (M14.5 — Knowledge Hub / Deen-101)
-- Date: 2026-08-06
-- Idempotent. Safe to re-run.
--
-- Four tables model a structured Islamic curriculum:
--
--   curriculum_levels    — Ibtidaiyyah / Mutawassitah / ... / Deen101 / Deen101-advanced
--   curriculum_subjects  — Fiqh / Aqeedah / Seerah / Tazkiyah / Arabic / ...
--   curriculum_lessons   — individual lessons (video / PDF / audio / text)
--   lesson_resources     — external URLs attached to a lesson (multiple per lesson)
--
-- Every row is sourced (source_name + source_url + license). No unattributed
-- content is served to users.
-- ---------------------------------------------------------------------------

create table if not exists public.curriculum_levels (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  track         text not null check (track in ('deen101', 'qawmi', 'alia', 'advanced')),
  order_index   integer not null,
  name_bn       text not null,
  name_en       text not null,
  name_ar       text,
  description_bn text,
  description_en text,
  created_at    timestamptz not null default now()
);

create table if not exists public.curriculum_subjects (
  id            uuid primary key default gen_random_uuid(),
  level_id      uuid references public.curriculum_levels(id) on delete cascade,
  slug          text not null,
  order_index   integer not null,
  name_bn       text not null,
  name_en       text not null,
  name_ar       text,
  description_bn text,
  description_en text,
  created_at    timestamptz not null default now(),
  unique (level_id, slug)
);

create table if not exists public.curriculum_lessons (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid references public.curriculum_subjects(id) on delete cascade,
  slug          text not null,
  order_index   integer not null,
  title_bn      text not null,
  title_en      text not null,
  title_ar      text,
  body_html_bn  text,
  body_html_en  text,
  source_name   text not null,
  source_url    text,
  license       text not null default 'permission-required',
  xp_reward     integer not null default 5,
  duration_min  integer,
  created_at    timestamptz not null default now(),
  unique (subject_id, slug)
);

create table if not exists public.lesson_resources (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid references public.curriculum_lessons(id) on delete cascade,
  kind          text not null check (kind in ('video', 'audio', 'pdf', 'text', 'quiz')),
  title         text not null,
  url           text not null,
  language      text not null default 'bn' check (language in ('bn', 'en', 'ar')),
  provider      text,               -- e.g. 'IOU', 'Yaqeen', 'iHadis'
  license       text not null default 'permission-required',
  created_at    timestamptz not null default now()
);

-- Indices --------------------------------------------------------------------
create index if not exists idx_curriculum_subjects_level
  on public.curriculum_subjects(level_id, order_index);
create index if not exists idx_curriculum_lessons_subject
  on public.curriculum_lessons(subject_id, order_index);
create index if not exists idx_lesson_resources_lesson
  on public.lesson_resources(lesson_id);

-- RLS -----------------------------------------------------------------------
alter table public.curriculum_levels enable row level security;
alter table public.curriculum_subjects enable row level security;
alter table public.curriculum_lessons enable row level security;
alter table public.lesson_resources enable row level security;

-- Everyone can read published curriculum.
drop policy if exists "Read curriculum levels" on public.curriculum_levels;
create policy "Read curriculum levels"    on public.curriculum_levels    for select using (true);
drop policy if exists "Read curriculum subjects" on public.curriculum_subjects;
create policy "Read curriculum subjects"  on public.curriculum_subjects  for select using (true);
drop policy if exists "Read curriculum lessons" on public.curriculum_lessons;
create policy "Read curriculum lessons"   on public.curriculum_lessons   for select using (true);
drop policy if exists "Read lesson resources" on public.lesson_resources;
create policy "Read lesson resources"     on public.lesson_resources     for select using (true);

-- Only admins mutate.
drop policy if exists "Admins mutate curriculum levels" on public.curriculum_levels;
create policy "Admins mutate curriculum levels"
  on public.curriculum_levels for all
  using (public.get_user_role(auth.uid()) = 'ADMIN')
  with check (public.get_user_role(auth.uid()) = 'ADMIN');
drop policy if exists "Admins mutate curriculum subjects" on public.curriculum_subjects;
create policy "Admins mutate curriculum subjects"
  on public.curriculum_subjects for all
  using (public.get_user_role(auth.uid()) = 'ADMIN')
  with check (public.get_user_role(auth.uid()) = 'ADMIN');
drop policy if exists "Admins mutate curriculum lessons" on public.curriculum_lessons;
create policy "Admins mutate curriculum lessons"
  on public.curriculum_lessons for all
  using (public.get_user_role(auth.uid()) = 'ADMIN')
  with check (public.get_user_role(auth.uid()) = 'ADMIN');
drop policy if exists "Admins mutate lesson resources" on public.lesson_resources;
create policy "Admins mutate lesson resources"
  on public.lesson_resources for all
  using (public.get_user_role(auth.uid()) = 'ADMIN')
  with check (public.get_user_role(auth.uid()) = 'ADMIN');

-- ---------------------------------------------------------------------------
-- END MIGRATION
-- ---------------------------------------------------------------------------
