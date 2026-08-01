-- M17: Push subscriptions table for Web Push notifications
-- Idempotent migration for push_subscriptions

-- Create table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON public.push_subscriptions(user_id);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read and write their own subscriptions
DROP POLICY IF EXISTS push_subscriptions_user_read ON public.push_subscriptions;
CREATE POLICY push_subscriptions_user_read
  ON public.push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS push_subscriptions_user_insert ON public.push_subscriptions;
CREATE POLICY push_subscriptions_user_insert
  ON public.push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS push_subscriptions_user_update ON public.push_subscriptions;
CREATE POLICY push_subscriptions_user_update
  ON public.push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS push_subscriptions_user_delete ON public.push_subscriptions;
CREATE POLICY push_subscriptions_user_delete
  ON public.push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: service_role bypasses (for Edge Functions)
DROP POLICY IF EXISTS push_subscriptions_service_role ON public.push_subscriptions;
CREATE POLICY push_subscriptions_service_role
  ON public.push_subscriptions
  USING (current_user_id() = current_setting('request.jwt.claims', true)::jsonb->>'sub'::text OR role() = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
