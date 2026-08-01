/**
 * Typed error surface for the content-integration layer.
 *
 * Every helper in `services/content/*` throws or returns a `ContentFetchError`
 * on failure so callers can distinguish upstream problems (rate-limit, 5xx,
 * malformed payload) from our own bugs.
 */

export type ContentSource =
  | 'alquran-cloud'
  | 'sunnah-com'
  | 'aladhan'
  | 'islamic-network'
  | 'ihadis'
  | 'cache'
  | 'other';

export interface ContentFetchErrorInit {
  source: ContentSource;
  message: string;
  status?: number;
  cause?: unknown;
  /** Present when we fell back to stale cache. */
  stale?: boolean;
}

export class ContentFetchError extends Error {
  readonly source: ContentSource;
  readonly status?: number;
  readonly cause?: unknown;
  readonly stale: boolean;

  constructor(init: ContentFetchErrorInit) {
    super(init.message);
    this.name = 'ContentFetchError';
    this.source = init.source;
    this.status = init.status;
    this.cause = init.cause;
    this.stale = init.stale ?? false;
  }
}

/**
 * Convenience wrapper — resolves to `{ ok: true, data }` or
 * `{ ok: false, error }`, so callers can `if (!res.ok) return` cleanly
 * without try/catch noise.
 */
export type Result<T> =
  | { ok: true; data: T; stale?: boolean }
  | { ok: false; error: ContentFetchError };

export const ok = <T>(data: T, stale = false): Result<T> => ({ ok: true, data, stale });
export const err = <T>(error: ContentFetchError): Result<T> => ({ ok: false, error });
