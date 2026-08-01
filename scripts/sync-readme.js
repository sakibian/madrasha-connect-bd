#!/usr/bin/env node
/**
 * README sync script — keeps README.md current with actual codebase state.
 *
 * Reads PROGRESS.md for the authoritative status + recent changes, then
 * updates the "Current State" table in README.md so it never gets stale.
 *
 * Run manually: `node scripts/sync-readme.js`
 * Run on commit: wired via simple-git-hooks (see package.json postinstall)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const README_PATH = join(ROOT, 'README.md');
const PROGRESS_PATH = join(ROOT, 'PROGRESS.md');

try {
  // Read the authoritative source of truth.
  const progress = readFileSync(PROGRESS_PATH, 'utf8');
  let readme = readFileSync(README_PATH, 'utf8');

  // Extract the "Last updated" timestamp and latest completed session.
  const timestampMatch = progress.match(/\*\*Last updated:\*\* (.+?) UTC/);
  const timestamp = timestampMatch?.[1] || new Date().toISOString().slice(0, 16);

  // Extract session count and latest major deliverables from the chronological log.
  const sessionMatches = [...progress.matchAll(/### (2026-\d{2}-\d{2}) \(session (\d+)/g)];
  const latestSession = Math.max(...sessionMatches.map(m => parseInt(m[2]) || 0));

  // Parse the Executive Status table to count completion percentage.
  const statusLines = progress.split('\n').filter(line => line.includes(' | '));
  const doneCount = statusLines.filter(line => line.includes('✅')).length;
  const readiness = Math.round((doneCount / Math.max(statusLines.length - 2, 1)) * 100);

  // Update the README's Current State section header.
  const dateStr = timestamp.split(' ')[0];
  const stateHeader = `## 📊 Current State (${dateStr})`;
  readme = readme.replace(
    /## 📊 Current State \([^)]+\)/,
    stateHeader
  );

  // Update the production readiness percentage.
  readme = readme.replace(
    /\| \*\*Production Readiness\*\* \| ~\*\*\d+%\*\*/,
    `| **Production Readiness** | ~**${readiness}%**`
  );

  // Update the MVP estimate if we're in the 80%+ range.
  if (readiness >= 80) {
    readme = readme.replace(
      /\*\*MVP soft-launch estimate:\*\* ~\d+-?\d* weeks?/,
      '**MVP soft-launch estimate:** ~1 week'
    );
  }

  writeFileSync(README_PATH, readme, 'utf8');
  console.log(`✅ README.md synced with PROGRESS.md (${timestamp}, ${readiness}% ready)`);

} catch (error) {
  console.error('❌ README sync failed:', error.message);
  process.exit(1);
}