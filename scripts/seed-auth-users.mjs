/* Seed test AUTH users via the Supabase Auth Admin API.
 *
 * This is the supported way to create users (raw INSERTs into auth.users
 * are fragile on Supabase cloud — instance_id/FK quirks cause
 * "Invalid login credentials" / "Database error querying schema").
 *
 * Usage:
 *   1. Get your Service Role key: Supabase Dashboard → Settings → API → service_role key
 *   2. Set env vars (or fill them in directly below):
 *        export SUPABASE_URL=https://qazcxnldkrklxdmunfgj.supabase.co
 *        export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *   3. node scripts/seed-auth-users.mjs
 *
 * The fixed UUIDs match database/seed-test-users.sql so the
 * public.user_profiles / public.scholars inserts keep working.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qazcxnldkrklxdmunfgj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it and re-run.');
  process.exit(1);
}

const PASSWORD = 'Test1234!';

const users = [
  { id: '11111111-1111-1111-1111-111111111111', email: 'admin@test.com',      user_metadata: { name: 'Admin User' } },
  { id: '22222222-2222-2222-2222-222222222222', email: 'scholar@test.com',    user_metadata: { name: 'মাওলানা রহিম উদ্দিন' } },
  { id: '33333333-3333-3333-3333-333333333333', email: 'institution@test.com', user_metadata: { name: 'দারুল উলুম মাদ্রাসা' } },
  { id: '44444444-4444-4444-4444-444444444444', email: 'user@test.com',        user_metadata: { name: 'আব্দুল্লাহ আহমেদ' } },
];

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

for (const u of users) {
  // Remove any pre-existing (possibly malformed) row so we create a clean one.
  await admin.auth.admin.deleteUser(u.id).catch(() => {});

  const { data, error } = await admin.auth.admin.createUser({
    id: u.id,
    email: u.email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: u.user_metadata,
  });

  if (error) {
    console.error(`✗ ${u.email}: ${error.message}`);
    continue;
  }
  console.log(`✓ ${u.email}: created`);
}

console.log('\nDone. Now run database/seed-test-users.sql for profiles/scholars (auth part is handled here).');
