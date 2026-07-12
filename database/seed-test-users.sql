/* Seed test user PROFILES + scholar data (password: Test1234!).
 *
 * NOTE: the auth.users rows themselves must be created via the Auth Admin API
 * (see scripts/seed-auth-users.mjs) — raw INSERTs into auth.users are fragile on
 * Supabase cloud and cause "Invalid login credentials" / "Database error querying schema".
 * Run that script first so these fixed UUIDs exist, then run this SQL for the profiles. */

create extension if not exists pgcrypto;

/* Create their profiles */
insert into public.user_profiles (id, name, role, avatar_url, phone) values
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'ADMIN', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', '+8801700000001'),
  ('22222222-2222-2222-2222-222222222222', 'মাওলানা রহিম উদ্দিন', 'SCHOLAR', 'https://api.dicebear.com/7.x/avataaars/svg?seed=scholar', '+8801700000002'),
  ('33333333-3333-3333-3333-333333333333', 'দারুল উলুম মাদ্রাসা', 'INSTITUTION', 'https://api.dicebear.com/7.x/avataaars/svg?seed=institution', '+8801700000003'),
  ('44444444-4444-4444-4444-444444444444', 'আব্দুল্লাহ আহমেদ', 'USER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user', '+8801700000004')
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  avatar_url = excluded.avatar_url,
  phone = excluded.phone;

/* Create scholar profile */
insert into public.scholars (user_id, title, specialization, institution, location, bio, verified) values
  ('22222222-2222-2222-2222-222222222222', 'মুফতি', 'ফিকহ ও হাদিস', 'দারুল উলুম মাদ্রাসা', 'ঢাকা', '১০ বছরের অভিজ্ঞ আলেম', true)
on conflict (user_id) do update set
  title = excluded.title,
  specialization = excluded.specialization,
  institution = excluded.institution,
  location = excluded.location,
  bio = excluded.bio,
  verified = excluded.verified;

/* Link institution to owner */
update public.institutions set owner_id = '33333333-3333-3333-3333-333333333333' where id = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

/* Link fatwas to test user */
update public.fatwas set asked_by = '44444444-4444-4444-4444-444444444444';

/* Link forum posts to test user */
update public.forum_posts set author_id = '44444444-4444-4444-4444-444444444444';
