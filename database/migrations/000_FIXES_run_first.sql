-- MIGRATION FIXES - RUN THIS FIRST
-- Fixes for common migration errors

-- 1. Create current_user_id() helper function
-- This is used by some RLS policies
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure uuid_generate_v4() extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create helper function for checking user existence
CREATE OR REPLACE FUNCTION user_exists(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now you can run the other migrations in order
