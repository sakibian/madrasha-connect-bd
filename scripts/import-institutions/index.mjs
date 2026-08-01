#!/usr/bin/env node
/**
 * scripts/import-institutions/index.mjs
 *
 * CLI orchestrator for bootstrapping the `institutions` table from public
 * Bangladeshi authoritative sources. See ./README.md for details.
 *
 * This scaffold prints a runbook + emits a normalised JSON preview when
 * invoked. Each real source implementation lives in ./sources/*.mjs and
 * exports an async `fetchAll()` returning normalised rows.
 *
 * Environment:
 *   SUPABASE_URL                (required for --write)
 *   SUPABASE_SERVICE_ROLE_KEY   (required for --write)
 *
 * Usage:
 *   node scripts/import-institutions/index.mjs --dry-run
 *   node scripts/import-institutions/index.mjs --source=bmeb --write
 *   node scripts/import-institutions/index.mjs --source=all --write
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse flags -----------------------------------------------------------------
const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const source = String(flags.source ?? 'all');
const write = Boolean(flags.write);
const dryRun = Boolean(flags['dry-run']) || !write;

// Registry of source adapters. Each adapter is loaded lazily so partial
// implementations don't crash the whole run.
const REGISTRY = {
  bmeb:    () => import('./sources/bmeb.mjs'),
  befaq:   () => import('./sources/befaq.mjs'),
  ifb:     () => import('./sources/ifb.mjs'),
  banbeis: () => import('./sources/banbeis.mjs'),
};

async function main() {
  console.log('\n📚 Institution Bootstrap Importer');
  console.log('=================================');
  console.log(`  source: ${source}`);
  console.log(`  mode:   ${dryRun ? 'DRY RUN (no DB writes)' : 'WRITE TO DB'}`);
  console.log('');

  const targets = source === 'all' ? Object.keys(REGISTRY) : [source];
  const allRows = [];

  for (const key of targets) {
    if (!REGISTRY[key]) {
      console.warn(`⚠  Unknown source: ${key} — skipping`);
      continue;
    }
    console.log(`→ Fetching ${key}...`);
    try {
      const mod = await REGISTRY[key]();
      if (typeof mod.fetchAll !== 'function') {
        console.warn(`   ${key}: adapter not implemented yet — see scripts/import-institutions/sources/${key}.mjs`);
        continue;
      }
      const rows = await mod.fetchAll();
      console.log(`   ${key}: ${rows.length} rows`);
      allRows.push(...rows);
    } catch (e) {
      console.error(`   ${key}: failed — ${e.message}`);
    }
  }

  // Deduplicate by (normalised name_bn + district), keeping the most authoritative row.
  const RANK = { BMEB: 4, Wifaq: 3, Befaq: 3, IFB: 2, Banbeis: 1, community: 0 };
  const map = new Map();
  for (const row of allRows) {
    const key = `${(row.name_bn || row.name || '').trim().replace(/\s+/g, ' ')}|${row.district || ''}`;
    const prev = map.get(key);
    if (!prev || (RANK[row.source_name] ?? 0) > (RANK[prev.source_name] ?? 0)) {
      map.set(key, row);
    }
  }
  const deduped = [...map.values()];
  console.log(`\nDeduplicated: ${allRows.length} → ${deduped.length} rows`);

  if (dryRun) {
    const outPath = resolve(__dirname, '_import_output.json');
    writeFileSync(outPath, JSON.stringify(deduped, null, 2));
    console.log(`\n💾 Dry run — wrote ${deduped.length} rows to ${outPath}`);
    console.log('   (nothing written to Supabase)');
    return;
  }

  // Real write requires @supabase/supabase-js loaded lazily so plain dry-runs
  // don't need the dep installed.
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY required for --write mode');
    process.exit(1);
  }
  const admin = createClient(url, key);
  const { error } = await admin.from('institutions').upsert(deduped, {
    onConflict: 'name_bn,district',
  });
  if (error) {
    console.error('❌ Upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`\n✅ Upserted ${deduped.length} institutions.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
