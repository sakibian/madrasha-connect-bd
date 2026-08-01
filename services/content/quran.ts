/**
 * Al-Quran Cloud client — https://alquran.cloud/api
 *
 * Free public API, no auth required. We proxy through a Supabase Edge Function
 * so we can cache aggressively and add rate limiting; if the edge function
 * isn't deployed we fall back to a direct browser fetch (still safe because
 * the upstream is fully public + CORS-open).
 *
 * Supported editions:
 *   - `quran-uthmani`   → Arabic Uthmani script
 *   - `bn.bengali`      → Bengali translation (Muhiuddin Khan)
 *   - `en.sahih`        → English Sahih International
 *   - `ar.alafasy`      → Recitation by Mishary Alafasy (audio ayah)
 */

import { cacheKey, readCache } from './cache';
import { ContentFetchError, ok, err, type Result } from './errors';
import { callEdgeFunction } from '../edgeFunctions';

const UPSTREAM = 'https://api.alquran.cloud/v1';
const SOURCE = 'alquran-cloud' as const;

// ----- Types (subset of the upstream schema we actually use) -----

export interface SurahMeta {
  number: number;
  name: string;              // Arabic name (السورة)
  englishName: string;       // Latin transliteration ("Al-Fatiha")
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;            // global 1..6236
  numberInSurah: number;
  text: string;
  audio?: string;
  audioSecondary?: string[];
  juz: number;
  page: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SurahWithAyahs extends SurahMeta {
  ayahs: Ayah[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: 'text' | 'audio';
    type: 'translation' | 'quran' | 'transliteration' | 'tafsir';
  };
}

// ----- Public API -----

/** Full list of 114 surahs (metadata only). Aggressively cacheable (24 h). */
export async function getSurahList(): Promise<Result<SurahMeta[]>> {
  return fetchViaEdge<SurahMeta[]>('surah', {});
}

/**
 * Get a full surah in a given edition.
 * @param surahNumber 1..114
 * @param edition   e.g. 'quran-uthmani' | 'bn.bengali' | 'en.sahih'
 */
export async function getSurah(surahNumber: number, edition = 'quran-uthmani'): Promise<Result<SurahWithAyahs>> {
  if (!(surahNumber >= 1 && surahNumber <= 114)) {
    return err(new ContentFetchError({ source: SOURCE, message: 'surahNumber must be 1..114' }));
  }
  return fetchViaEdge<SurahWithAyahs>(`surah/${surahNumber}/${edition}`, { edition });
}

/**
 * Get a specific ayah in a given edition. Accepts either a global ayah number
 * (1..6236) or "surah:ayah" like "2:255".
 */
export async function getAyah(reference: string | number, edition = 'quran-uthmani'): Promise<Result<Ayah>> {
  const ref = String(reference);
  return fetchViaEdge<Ayah>(`ayah/${encodeURIComponent(ref)}/${edition}`, { ref, edition });
}

/** Returns the audio URL for a single ayah in a given reciter edition. */
export function ayahAudioUrl(globalAyahNumber: number, edition = 'ar.alafasy', bitrate: 32 | 64 | 128 = 128): string {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalAyahNumber}.mp3`;
}

// ----- Internal -----

async function fetchViaEdge<T>(endpoint: string, params: Record<string, string | number | undefined>): Promise<Result<T>> {
  const key = cacheKey(SOURCE, endpoint, params);

  // 1. Try cache first (browser-safe read).
  const cached = await readCache<T>(key);
  if (cached) return ok(cached.value);

  // 2. Try the edge proxy (writes cache server-side).
  try {
    const edge = await callEdgeFunction<{ data?: T; error?: string }>('quran-proxy', { endpoint, params });
    if (edge?.data !== undefined) return ok(edge.data);
  } catch {
    // fall through
  }

  // 3. Last-resort: direct fetch. Al-Quran Cloud is CORS-open + no auth.
  try {
    const res = await fetch(`${UPSTREAM}/${endpoint}`);
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
