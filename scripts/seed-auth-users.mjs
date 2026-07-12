/* Seed test AUTH users via the Supabase Auth Admin API (raw fetch for clear errors).
 *
 * Raw INSERTs into auth.users are fragile on Supabase cloud (missing auth.identities
 * row + wrong instance_id -> "Database error querying schema"). The Admin API creates
 * everything correctly.
 *
 * Usage:
 *   export SUPABASE_URL=https://qazcxnldkrklxdmunfgj.supabase.co
 *   export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *   node scripts/seed-auth-users.mjs            # create the 4 users
 *   node scripts/seed-auth-users.mjs --reset     # delete ALL auth.users first, then create
 *
 * Fixed UUIDs match database/seed-test-users.sql so profile/scholar inserts keep working.
 */

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://qazcxnldkrklxdmunfgj.supabase.co').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESET = process.argv.includes('--reset');
const PASSWORD = 'Test1234!';

if (!KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it and re-run.');
  process.exit(1);
}

const users = [
  { id: '11111111-1111-1111-1111-111111111111', email: 'admin@test.com',      user_metadata: { name: 'Admin User' } },
  { id: '22222222-2222-2222-2222-222222222222', email: 'scholar@test.com',    user_metadata: { name: 'মাওলানা রহিম উদ্দিন' } },
  { id: '33333333-3333-3333-3333-333333333333', email: 'institution@test.com', user_metadata: { name: 'দারুল উলুম মাদ্রাসা' } },
  { id: '44444444-4444-4044-4444-444444444444', email: 'user@test.com',        user_metadata: { name: 'আব্দুল্লাহ আহমেদ' } },
];

const authHeaders = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

async function api(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/${path}`, {
    method,
    headers: authHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, json };
}

(async () => {
  const probe = await api('GET', 'users?per_page=1');
  console.log(`Probe GET /auth/v1/admin/users → HTTP ${probe.status}`);
  if (probe.status === 401) {
    console.error('Service role key rejected (401). Use the service_role key from Settings → API.');
    process.exit(1);
  }
  if (probe.status >= 400) {
    console.error('Probe failed:', probe.status, probe.json);
    process.exit(1);
  }

  if (RESET) {
    const list = await api('GET', 'users?per_page=1000');
    const ids = (list.json?.users || []).map((u) => u.id);
    for (const id of ids) {
      const r = await api('DELETE', `users/${id}`);
      console.log(`delete ${id} → ${r.status}`);
    }
  }

  for (const u of users) {
    await api('DELETE', `users/${u.id}`).catch(() => {});
    const r = await api('POST', 'users', {
      id: u.id,
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: u.user_metadata,
      app_metadata: { provider: 'email', providers: ['email'] },
    });
    if (r.status >= 200 && r.status < 300) {
      console.log(`✓ ${u.email}: created (HTTP ${r.status})`);
    } else {
      console.error(`✗ ${u.email}: HTTP ${r.status}`, JSON.stringify(r.json));
    }
  }

  console.log('\nDone. Now run database/seed-test-users.sql for profiles/scholars.');
})();
