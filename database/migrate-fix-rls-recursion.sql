/* Migration: Fix RLS recursion on user_profiles. Run in Supabase SQL Editor. */

-- 1. Create helper function
create or replace function public.get_user_role(uid uuid)
returns text
language sql
security definer
stable
as $$
  select role from public.user_profiles where id = uid;
$$;

grant execute on function public.get_user_role(uuid) to authenticated;
grant execute on function public.get_user_role(uuid) to anon;

-- 2. Fix user_profiles admin policies (THE RECURSION)
drop policy if exists "Admins can read all profiles" on public.user_profiles;
drop policy if exists "Admins can update all profiles" on public.user_profiles;

create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (public.get_user_role(auth.uid()) = 'ADMIN');

create policy "Admins can update all profiles"
  on public.user_profiles for update
  using (public.get_user_role(auth.uid()) = 'ADMIN');
