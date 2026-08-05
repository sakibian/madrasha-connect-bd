-- Add missing UPDATE/DELETE RLS policies + updated_at columns for USER-role CRUD
-- Run after: base schema.sql (000_FIXES_run_first.sql)
-- This migration is idempotent: every CREATE POLICY is preceded by DROP POLICY IF EXISTS

-- =====================================================================
-- 1. forum_posts: Add UPDATE/DELETE for post owners
-- =====================================================================

-- Add updated_at column if not present
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow users to update their own posts (title, content, category)
DROP POLICY IF EXISTS "Users can update own posts" ON public.forum_posts;
CREATE POLICY "Users can update own posts"
  ON public.forum_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Allow users to delete their own posts
DROP POLICY IF EXISTS "Users can delete own posts" ON public.forum_posts;
CREATE POLICY "Users can delete own posts"
  ON public.forum_posts FOR DELETE
  USING (auth.uid() = author_id);

-- =====================================================================
-- 2. forum_comments: Fix id column + Add UPDATE/DELETE for comment owners
-- =====================================================================

-- The forum_comments.id column is `text primary key` with no default.
-- Inserts without an id fail with NOT NULL violation. Add a default so
-- Supabase client inserts (which don't pass id) work.
-- Uses uuid_generate_v4() from the uuid-ossp extension created in schema.sql.
ALTER TABLE public.forum_comments ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;

-- Add updated_at column
ALTER TABLE public.forum_comments ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow users to update their own comments (content only)
DROP POLICY IF EXISTS "Users can update own comments" ON public.forum_comments;
CREATE POLICY "Users can update own comments"
  ON public.forum_comments FOR UPDATE
  USING (auth.uid() = author_id);

-- Allow users to delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON public.forum_comments;
CREATE POLICY "Users can delete own comments"
  ON public.forum_comments FOR DELETE
  USING (auth.uid() = author_id);

-- =====================================================================
-- 3. fatwas: Add UPDATE/DELETE for question owners
-- =====================================================================

-- Add updated_at column
ALTER TABLE public.fatwas ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow users to update their own fatwa questions (question, category only)
DROP POLICY IF EXISTS "Users can update own fatwas" ON public.fatwas;
CREATE POLICY "Users can update own fatwas"
  ON public.fatwas FOR UPDATE
  USING (auth.uid() = asked_by);

-- Allow users to delete their own fatwa questions
DROP POLICY IF EXISTS "Users can delete own fatwas" ON public.fatwas;
CREATE POLICY "Users can delete own fatwas"
  ON public.fatwas FOR DELETE
  USING (auth.uid() = asked_by);

-- =====================================================================
-- 4. job_applications: Add DELETE for applicant (withdraw application)
-- =====================================================================

-- Allow users to delete their own applications (i.e., withdraw)
DROP POLICY IF EXISTS "Users can delete own applications" ON public.job_applications;
CREATE POLICY "Users can delete own applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = applicant_id);

-- =====================================================================
-- 5. blood_donors: Add UPDATE/DELETE for donor (edit profile info)
-- =====================================================================

-- Allow users to update their own donor profile
DROP POLICY IF EXISTS "Users can update own donor profile" ON public.blood_donors;
CREATE POLICY "Users can update own donor profile"
  ON public.blood_donors FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own donor profile
DROP POLICY IF EXISTS "Users can delete own donor profile" ON public.blood_donors;
CREATE POLICY "Users can delete own donor profile"
  ON public.blood_donors FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================================
-- 6. user_skills: Allow users to UPDATE own skills (rename)
-- =====================================================================

DROP POLICY IF EXISTS "Users can update own skills" ON public.user_skills;
CREATE POLICY "Users can update own skills"
  ON public.user_skills FOR UPDATE
  USING (auth.uid() = user_id);
