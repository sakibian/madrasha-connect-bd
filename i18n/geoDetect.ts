/**
 * IP-based geo language detection.
 *
 * We call a free public geolocation API to guess the visitor's country
 * ONLY when they have no saved preference. The result is cached for 7 days
 * in `localStorage.mc_geo_lang` so we don't hit the API on every page load.
 *
 * Priority chain (defined in `i18n/config.ts`):
 *   querystring `?lang=xx`
 *   ↓
 *   localStorage `mc_language`   ← user's explicit choice (highest priority)
 *   ↓
 *   IP geo (this file)           ← smart default for first-time visitors
 *   ↓
 *   navigator.language           ← browser's Accept-Language header
 *   ↓
 *   'bn' (Bangladesh-first fallback)
 *
 * Design goals:
 *   - Zero cost: uses the free tier of ipapi.co (~1000 req/day per IP).
 *   - Non-blocking: returns quickly with `null` on any error.
 *   - Deterministic: pure function of country_code → LangCode.
 *   - Test-friendly: `mapCountryToLang` is exported for direct unit testing.
 */

import type { LangCode } from './config';

const CACHE_KEY = 'mc_geo_lang';
const CACHE_TTL_DAYS = 7;
const CACHE_TTL_MS = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

/** Countries where Bengali is a primary language. */
export const BENGALI_COUNTRIES = new Set<string>([
  'BD', // Bangladesh (primary)
  // NOTE: India (IN) has 90M+ Bengali speakers concentrated in West Bengal,
  // but we can't distinguish them from the geo signal alone. Falls back to
  // navigator.language which respects the user's browser preference.
]);

/** Countries where Arabic is a primary language (Arab League + Palestine). */
export const ARABIC_COUNTRIES = new Set<string>([
  'SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'OM', 'IQ', 'JO', 'LB',
  'SY', 'YE', 'LY', 'DZ', 'MA', 'TN', 'PS', 'SD', 'MR', 'SO',
  'DJ', 'KM',
]);

/**
 * Pure mapping — given an ISO country code + optional preferred-languages hint,
 * return the best-fit supported LangCode, or null if we can't decide.
 */
export function mapCountryToLang(
  countryCode: string | null | undefined,
  preferredLanguages?: string,
): LangCode | null {
  if (!countryCode) return null;
  const cc = countryCode.trim().toUpperCase();

  // A browser-provided preferred-languages hint wins over pure country lookup
  // when it clearly indicates one of our supported scripts.
  const langs = (preferredLanguages ?? '').toLowerCase();
  if (langs.includes('bn')) return 'bn';
  if (langs.startsWith('ar') || langs.includes(',ar')) return 'ar';

  if (BENGALI_COUNTRIES.has(cc)) return 'bn';
  if (ARABIC_COUNTRIES.has(cc)) return 'ar';
  return 'en';
}

/** Structure of the cached row. */
interface CacheRow {
  lang: LangCode;
  cachedAt: number;
  country?: string;
}

function readCache(): CacheRow | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const row = JSON.parse(raw) as CacheRow;
    if (typeof row?.lang !== 'string') return null;
    if (Date.now() - row.cachedAt > CACHE_TTL_MS) return null;
    return row;
  } catch {
    return null;
  }
}

function writeCache(lang: LangCode, country?: string): void {
  try {
    const row: CacheRow = { lang, cachedAt: Date.now(), country };
    localStorage.setItem(CACHE_KEY, JSON.stringify(row));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/** Clear the cache — useful for tests + admin diagnostics. */
export function clearGeoCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch { /* ignore */ }
}

/**
 * Provider adapter — swap here if we ever move off ipapi.co.
 * Returns { country_code, languages } or throws.
 */
async function fetchFromIpapi(signal?: AbortSignal): Promise<{ country_code?: string; languages?: string }> {
  const res = await fetch('https://ipapi.co/json/', { signal });
  if (!res.ok) throw new Error(`ipapi.co HTTP ${res.status}`);
  return res.json();
}

async function fetchFromIpwho(signal?: AbortSignal): Promise<{ country_code?: string; languages?: string }> {
  const res = await fetch('https://ipwho.is/', { signal });
  if (!res.ok) throw new Error(`ipwho.is HTTP ${res.status}`);
  const body = await res.json();
  // Different shape — normalise.
  return { country_code: body?.country_code, languages: body?.connection?.isp };
}

/**
 * Public API — detect the best language for the current visitor.
 *
 * @param timeoutMs Aborts the fetch after this many ms so we never hold up
 *                  first paint. Default 2500ms.
 * @returns The best-fit LangCode, or null if we can't decide (caller should
 *          fall back to `navigator.language` → 'bn').
 */
export async function detectLanguageFromGeo(timeoutMs = 2500): Promise<LangCode | null> {
  if (typeof window === 'undefined') return null;

  // 1. Hit cache first.
  const cached = readCache();
  if (cached) return cached.lang;

  // 2. Dev override — `?geo=SA` in the URL for QA testing.
  try {
    const p = new URLSearchParams(window.location.search);
    const devGeo = p.get('geo');
    if (devGeo) {
      const lang = mapCountryToLang(devGeo);
      if (lang) {
        writeCache(lang, devGeo);
        return lang;
      }
    }
  } catch { /* ignore */ }

  // 3. Live fetch with timeout + provider fallback.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let body: { country_code?: string; languages?: string };
    try {
      body = await fetchFromIpapi(controller.signal);
    } catch {
      body = await fetchFromIpwho(controller.signal);
    }
    const lang = mapCountryToLang(body.country_code, body.languages);
    if (lang) {
      writeCache(lang, body.country_code);
      return lang;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
