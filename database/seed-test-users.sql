/* Seed 4 test users with password: Test1234! */

create extension if not exists pgcrypto;

/* Resolve the project's auth instance id so users appear in the dashboard */
do $$
declare
  v_instance uuid := (select id from auth.instances limit 1);
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, created_at, updated_at
  ) values
    ('11111111-1111-1111-1111-111111111111', v_instance, 'authenticated', 'authenticated',
     'admin@test.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', now(), now()),
    ('22222222-2222-2222-2222-222222222222', v_instance, 'authenticated', 'authenticated',
     'scholar@test.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', now(), now()),
    ('33333333-3333-3333-3333-333333333333', v_instance, 'authenticated', 'authenticated',
     'institution@test.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', now(), now()),
    ('44444444-4444-4444-4444-444444444444', v_instance, 'authenticated', 'authenticated',
     'user@test.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', now(), now())
  on conflict (id) do update set
    instance_id = excluded.instance_id,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data;
end $$;

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
