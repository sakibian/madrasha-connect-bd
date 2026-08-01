/**
 * Aladhan client — https://aladhan.com/prayer-times-api
 *
 * Free public API, no auth. We support:
 *   - Prayer times by city (best for BD district defaults)
 *   - Prayer times by lat/lon (mobile GPS)
 *   - Qibla direction from lat/lon
 *
 * All calls go through the edge proxy first for caching.
 */

import { cacheKey, readCache } from './cache';
import { ContentFetchError, ok, err, type Result } from './errors';
import { callEdgeFunction } from '../edgeFunctions';

const UPSTREAM = 'https://api.aladhan.com/v1';
const SOURCE = 'aladhan' as const;

// Calculation method — 3 = Muslim World League (safe default for BD).
// See https://aladhan.com/calculation-methods for full list.
export const DEFAULT_METHOD = 3;

export interface PrayerTimings {
  Fajr: string;    // "HH:mm"
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird?: string;
  Lastthird?: string;
}

export interface HijriDate {
  date: string;        // "DD-MM-YYYY"
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

export interface PrayerTimesResponse {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDate;
    gregorian: { date: string; day: string; month: { number: number; en: string }; year: string };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: { id: number; name: string };
  };
}

export interface QiblaResponse {
  latitude: number;
  longitude: number;
  direction: number;   // degrees from true north
}

// ----- Public API -----

/** Prayer times for a Bangladesh city (default: Dhaka). Cached for 24h. */
export async function getPrayerTimesByCity(
  city = 'Dhaka',
  country = 'BD',
  date = todayYmd(),
  method = DEFAULT_METHOD,
): Promise<Result<PrayerTimesResponse>> {
  return fetchViaEdge<PrayerTimesResponse>(
    `timingsByCity/${encodeURIComponent(date)}`,
    { city, country, method },
  );
}

/** Prayer times for a lat/lon pair. */
export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  date = todayYmd(),
  method = DEFAULT_METHOD,
): Promise<Result<PrayerTimesResponse>> {
  return fetchViaEdge<PrayerTimesResponse>(
    `timings/${encodeURIComponent(date)}`,
    { latitude, longitude, method },
  );
}

/** Qibla direction (degrees clockwise from true north) for a coordinate pair. */
export async function getQibla(latitude: number, longitude: number): Promise<Result<QiblaResponse>> {
  return fetchViaEdge<QiblaResponse>(`qibla/${latitude}/${longitude}`, { latitude, longitude });
}

// ----- Helpers -----

function todayYmd(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function fetchViaEdge<T>(endpoint: string, params: Record<string, string | number | undefined>): Promise<Result<T>> {
  const key = cacheKey(SOURCE, endpoint, params);
  const cached = await readCache<T>(key);
  if (cached) return ok(cached.value);

  try {
    const edge = await callEdgeFunction<{ data?: T; error?: string }>('prayer-proxy', { endpoint, params });
    if (edge?.data !== undefined) return ok(edge.data);
  } catch { /* ignore */ }

  try {
    const url = new URL(`${UPSTREAM}/${endpoint}`);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
      return err(new ContentFetchError({ source: SOURCE, message: `HTTP ${res.status}`, status: res.status }));
    }
    const body = await res.json();
    if (body?.code !== 200 || body?.data === undefined) {
      return err(new ContentFetchError({ source: SOURCE, message: body?.status ?? 'malformed upstream response' }));
    }
    return ok(body.data as T);
  } catch (e) {
    return err(new ContentFetchError({ source: SOURCE, message: 'network error', cause: e }));
  }
}
