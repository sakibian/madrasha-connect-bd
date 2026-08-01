/**
 * Hijri calendar helpers via Aladhan.
 *
 * Everything here piggybacks on the prayer-times endpoint (which returns
 * paired hijri+gregorian dates) so we only need one upstream provider.
 */

import { cacheKey, readCache } from './cache';
import { ContentFetchError, ok, err, type Result } from './errors';
import { callEdgeFunction } from '../edgeFunctions';

const UPSTREAM = 'https://api.aladhan.com/v1';
const SOURCE = 'aladhan' as const;

export interface HijriToday {
  hijri: {
    date: string;              // "DD-MM-YYYY"
    day: string;
    month: { number: number; en: string; ar: string };
    year: string;
    weekday: { en: string; ar: string };
  };
  gregorian: {
    date: string;
    day: string;
    month: { number: number; en: string };
    year: string;
    weekday: { en: string };
  };
}

/** Today's Hijri date paired with Gregorian. Cached for 6h. */
export async function getHijriToday(): Promise<Result<HijriToday>> {
  const key = cacheKey(SOURCE, 'gToH:today');
  const cached = await readCache<HijriToday>(key);
  if (cached) return ok(cached.value);

  try {
    const edge = await callEdgeFunction<{ data?: HijriToday; error?: string }>('hijri-proxy', {
      endpoint: 'gToH',
      params: { date: fmt(new Date()) },
    });
    if (edge?.data) return ok(edge.data);
  } catch { /* ignore */ }

  try {
    const url = `${UPSTREAM}/gToH?date=${encodeURIComponent(fmt(new Date()))}`;
    const res = await fetch(url);
    if (!res.ok) return err(new ContentFetchError({ source: SOURCE, message: `HTTP ${res.status}`, status: res.status }));
    const body = await res.json();
    if (body?.code !== 200 || !body?.data) {
      return err(new ContentFetchError({ source: SOURCE, message: body?.status ?? 'malformed upstream response' }));
    }
    return ok(body.data as HijriToday);
  } catch (e) {
    return err(new ContentFetchError({ source: SOURCE, message: 'network error', cause: e }));
  }
}

/** Convert an arbitrary Gregorian date to Hijri. */
export async function gregorianToHijri(gregorian: Date): Promise<Result<HijriToday>> {
  const key = cacheKey(SOURCE, 'gToH', { date: fmt(gregorian) });
  const cached = await readCache<HijriToday>(key);
  if (cached) return ok(cached.value);

  try {
    const res = await fetch(`${UPSTREAM}/gToH?date=${encodeURIComponent(fmt(gregorian))}`);
    if (!res.ok) return err(new ContentFetchError({ source: SOURCE, message: `HTTP ${res.status}`, status: res.status }));
    const body = await res.json();
    if (body?.code !== 200 || !body?.data) {
      return err(new ContentFetchError({ source: SOURCE, message: body?.status ?? 'malformed upstream response' }));
    }
    return ok(body.data as HijriToday);
  } catch (e) {
    return err(new ContentFetchError({ source: SOURCE, message: 'network error', cause: e }));
  }
}

/** Convert an arbitrary Hijri date (DD-MM-YYYY) to Gregorian. */
export async function hijriToGregorian(hijriDdMmYyyy: string): Promise<Result<HijriToday>> {
  const key = cacheKey(SOURCE, 'hToG', { date: hijriDdMmYyyy });
  const cached = await readCache<HijriToday>(key);
  if (cached) return ok(cached.value);

  try {
    const res = await fetch(`${UPSTREAM}/hToG?date=${encodeURIComponent(hijriDdMmYyyy)}`);
    if (!res.ok) return err(new ContentFetchError({ source: SOURCE, message: `HTTP ${res.status}`, status: res.status }));
    const body = await res.json();
    if (body?.code !== 200 || !body?.data) {
      return err(new ContentFetchError({ source: SOURCE, message: body?.status ?? 'malformed upstream response' }));
    }
    return ok(body.data as HijriToday);
  } catch (e) {
    return err(new ContentFetchError({ source: SOURCE, message: 'network error', cause: e }));
  }
}

function fmt(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}
