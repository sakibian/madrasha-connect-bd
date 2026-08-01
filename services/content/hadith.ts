/**
 * Sunnah.com client — https://sunnah.com/developers
 *
 * Requires a free API key (`X-API-Key` header). The key is server-side ONLY;
 * the browser must go through the `hadith-proxy` edge function. We do NOT
 * ship a direct-fetch fallback because that would require exposing the key.
 *
 * If the edge proxy isn't deployed / the key is missing, calls return a
 * ContentFetchError of source='sunnah-com' with status=503 so callers can
 * render a graceful "coming soon" placeholder.
 */

import { cacheKey, readCache } from './cache';
import { ContentFetchError, ok, err, type Result } from './errors';
import { callEdgeFunction } from '../edgeFunctions';

const SOURCE = 'sunnah-com' as const;

export interface CollectionSummary {
  name: string;                    // slug e.g. 'bukhari'
  hasBooks: boolean;
  hasChapters: boolean;
  collection: Array<{ lang: 'ar' | 'en' | 'bn' | string; title: string; shortIntro?: string }>;
  totalHadith: number;
  totalAvailableHadith: number;
}

export interface BookSummary {
  bookNumber: string;
  book: Array<{ lang: string; name: string }>;
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

export interface Hadith {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: Array<{
    lang: 'ar' | 'en' | 'bn' | string;
    chapterNumber?: string;
    chapterTitle?: string;
    body: string;
    grades?: Array<{ graded_by: string; grade: string }>;
  }>;
}

// ----- Public API -----

/** All available collections (bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah, ...). */
export async function getCollections(): Promise<Result<CollectionSummary[]>> {
  return proxy<CollectionSummary[]>('collections');
}

/** Books inside a collection (chapters of Sahih al-Bukhari for example). */
export async function getBooks(collectionName: string): Promise<Result<BookSummary[]>> {
  if (!collectionName) return err(new ContentFetchError({ source: SOURCE, message: 'collectionName required' }));
  return proxy<BookSummary[]>(`collections/${encodeURIComponent(collectionName)}/books`, { collectionName });
}

/** A single hadith by collection + hadith number. */
export async function getHadith(collectionName: string, hadithNumber: string | number): Promise<Result<Hadith>> {
  if (!collectionName) return err(new ContentFetchError({ source: SOURCE, message: 'collectionName required' }));
  return proxy<Hadith>(
    `collections/${encodeURIComponent(collectionName)}/hadiths/${encodeURIComponent(String(hadithNumber))}`,
    { collectionName, hadithNumber },
  );
}

// ----- Internal -----

async function proxy<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<Result<T>> {
  const key = cacheKey(SOURCE, endpoint, params);
  const cached = await readCache<T>(key);
  if (cached) return ok(cached.value);

  try {
    const res = await callEdgeFunction<{ data?: T; error?: string }>('hadith-proxy', { endpoint, params });
    if (res?.data !== undefined) return ok(res.data);
    return err(new ContentFetchError({
      source: SOURCE,
      status: 503,
      message: res?.error ?? 'hadith-proxy unavailable — deploy the edge function and set SUNNAH_API_KEY',
    }));
  } catch (e) {
    return err(new ContentFetchError({ source: SOURCE, message: 'network error', cause: e }));
  }
}
