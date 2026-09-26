#!/usr/bin/env node
/**
 * Post-build prerender — bakes real HTML for public routes into dist/.
 *
 * Why: the app is a pure client-side SPA, so crawlers and social scrapers
 * used to see an empty <div id="root">. This script serves dist/ locally,
 * drives headless Chrome through each public route, waits for the
 * `#app-ready` sentinel (rendered by App.tsx once the auth store finishes
 * initializing), then writes the serialized DOM to dist/<route>/index.html.
 *
 * Vercel serves those files directly (filesystem is checked before the
 * SPA-fallback rewrite), so /about, /faq, etc. ship real Bangla content
 * + per-page Helmet meta in the initial response.
 *
 * Env:
 *   PRERENDER=false   — skip entirely (escape hatch for CI/deploys)
 *   PRERENDER_LANG    — language to prerender in (default: bn)
 *
 * Never fails the build: if Chrome can't launch we warn and exit 0.
 *
 * Run: `node scripts/prerender.mjs` (wired into `npm run build`)
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const LANG = process.env.PRERENDER_LANG || 'bn';
const PORT = 4173;
// Canonical origin baked into the static HTML — helmet emits the local
// server origin during prerender, so we rewrite it to production.
const PROD_ORIGIN = process.env.PRERENDER_ORIGIN || 'https://qowmi.mvp.bd';

// Public, crawl-worthy routes. Keep in sync with App.tsx — protected or
// personalized routes (dashboard, search, /profile/:id) are intentionally
// excluded. Dynamic detail pages (institution/:id) can be generated later
// by pulling IDs from Supabase at build time.
const ROUTES = [
  '/',
  '/about',
  '/faq',
  '/terms',
  '/privacy',
  '/accessibility',
  '/help',
  '/qawmi-system',
  '/deen101',
  '/seerah',
  '/knowledge',
  '/institutions',
  '/scholars',
  '/fatwa',
  '/fatwa/archive',
  '/events',
  '/sadaqah',
  '/community',
  '/marketplace',
  '/professional',
  '/audio-library',
  '/tools',
  '/calligraphy',
  '/competitions',
  '/leaderboard',
  '/login',
  '/register-user',
  '/register-institution',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

if (process.env.PRERENDER === 'false') {
  console.log('[prerender] PRERENDER=false — skipping.');
  process.exit(0);
}

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[prerender] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

// Minimal static server with SPA fallback (mirrors vercel.json rewrites).
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // Vercel Analytics injects /_vercel/insights/script.js — it only exists on
  // Vercel, so 404 it here instead of serving the HTML fallback (which would
  // throw "Unexpected token '<'" script errors in the page).
  if (urlPath.startsWith('/_vercel/')) {
    res.writeHead(404).end();
    return;
  }
  const filePath = join(DIST, urlPath);
  const target =
    existsSync(filePath) && !filePath.endsWith('/') && extname(filePath)
      ? filePath
      : join(DIST, 'index.html');
  try {
    const body = readFileSync(target);
    res.writeHead(200, { 'Content-Type': MIME[extname(target)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));

const t0 = Date.now();
let browser;
try {
  const { default: puppeteer } = await import('puppeteer');
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
} catch (err) {
  console.warn(`[prerender] Chrome unavailable (${err.message}) — skipping prerender.`);
  server.close();
  process.exit(0);
}

let done = 0;
let failed = 0;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  // Force the prerender language before any app code runs — headless Chrome
  // defaults to en-US, but Bangla is our SEO priority.
  await page.evaluateOnNewDocument((lang) => {
    try {
      localStorage.setItem('mc_language', lang);
    } catch {}
  }, LANG);
  page.on('pageerror', (e) => console.warn(`  [pageerror] ${e.message}`));

  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'load',
        timeout: 30000,
      });
      // Wait for post-init render, then give lazy chunks + first fetches a beat.
      await page.waitForSelector('#app-ready', { timeout: 15000 });
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 400));

      let html = '<!DOCTYPE html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
      html = html.replaceAll(`http://localhost:${PORT}`, PROD_ORIGIN);
      const outDir = route === '/' ? DIST : join(DIST, route);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), html);
      done++;
      console.log(`[prerender] ${route} (${(html.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed++;
      console.warn(`[prerender] ${route} FAILED: ${err.message}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`[prerender] ${done}/${ROUTES.length} routes prerendered in ${((Date.now() - t0) / 1000).toFixed(1)}s${failed ? ` (${failed} failed)` : ''}`);
