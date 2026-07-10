
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qazcxnldkrklxdmunfgj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhemN4bmxka3JrbHhkbXVuZmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTY5NzksImV4cCI6MjA5ODkzMjk3OX0.Ucghy4SJj_s6K63Mcv6McTTbRV8MFrj8uLsYlujiDF0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ALL_TABLES = [
  'user_profiles', 'institutions', 'jobs', 'job_applications',
  'scholars', 'fatwas', 'fatwa_answers', 'products',
  'courses', 'enrollments', 'notifications', 'forum_posts',
  'forum_comments', 'sadaqah_projects', 'donations', 'events',
  'audit_log', 'sources', 'content_sources', 'content_flags',
  'scholar_applications', 'content_versions', 'user_xp', 'badges',
  'user_badges', 'xp_events', 'user_skills', 'skill_endorsements',
  'scholar_portfolios', 'forum_post_likes', 'admin_audit_log',
  'referrals', 'push_tokens',
];

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    if (error) return { name: tableName, exists: false, rows: 0, error: error.message };
    return { name: tableName, exists: true, rows: count || 0, error: null };
  } catch (e) {
    return { name: tableName, exists: false, rows: 0, error: e.message };
  }
}

async function checkAuth() {
  const { data, error } = await supabase.auth.getSession();
  return { active: !error, error: error?.message };
}

async function main() {
  console.log('=== Madrasa Connect BD — Database Audit ===\n');
  console.log(`Project: ${SUPABASE_URL}\n`);

  console.log('Checking auth...');
  const auth = await checkAuth();
  console.log(`Auth: ${auth.active ? 'OK' : 'ERROR: ' + auth.error}\n`);

  console.log(`Checking ${ALL_TABLES.length} tables...\n`);
  const results = [];
  for (const table of ALL_TABLES) {
    const r = await checkTable(table);
    results.push(r);
  }

  const existing = results.filter(r => r.exists);
  const missing = results.filter(r => !r.exists);

  console.log('┌─────────────────────────────────────┬────────┬───────┐');
  console.log('│ Table                               │ Status │ Rows  │');
  console.log('├─────────────────────────────────────┼────────┼───────┤');
  for (const r of results) {
    const name = r.name.padEnd(35);
    const status = r.exists ? '  ✅  ' : '  ❌  ';
    const rows = r.exists ? String(r.rows).padStart(5) : '  N/A ';
    console.log(`│ ${name} │${status}│ ${rows} │`);
  }
  console.log('└─────────────────────────────────────┴────────┴───────┘');
  console.log(`\n${existing.length}/${ALL_TABLES.length} tables exist`);
  if (missing.length > 0) {
    console.log(`\nMissing tables (${missing.length}):`);
    for (const r of missing) {
      console.log(`  ❌ ${r.name} — ${r.error}`);
    }
  }
}

main().catch(console.error);
