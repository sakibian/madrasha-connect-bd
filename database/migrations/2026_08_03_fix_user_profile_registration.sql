-- Fix: user_profiles INSERT blocked by RLS during registration
-- Issue: registerUser() calls supabase.from('user_profiles').insert() after signUp(),
-- but there's no INSERT RLS policy on user_profiles (only SELECT/UPDATE).
-- The handle_new_auth_user trigger already creates the row, so we:
-- 1. Add an INSERT policy as a safety net (auth.uid() = id)
-- 2. Update the trigger to pass name/institution_name from user metadata

-- Add INSERT policy (safety net in case trigger migration isn't applied)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update the trigger function to read name and role from raw_user_meta_data
-- so user_profiles is pre-populated correctly before the UPDATE in registerUser
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, name, role, institution_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'ব্যবহাকারী'),
    coalesce(new.raw_user_meta_data->>'role', 'USER'),
    new.raw_user_meta_data->>'institution_name',
    new.phone
  )
  on conflict (id) do update
    set name = excluded.name,
        role = excluded.role,
        institution_name = excluded.institution_name;
  return new;
end;
$$;
