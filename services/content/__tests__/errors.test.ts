import { describe, it, expect } from 'vitest';
import { ContentFetchError, ok, err } from '../errors';

describe('ContentFetchError', () => {
  it('captures source, status, and stale flag', () => {
    const e = new ContentFetchError({ source: 'aladhan', message: 'oops', status: 502, stale: true });
    expect(e.name).toBe('ContentFetchError');
    expect(e.source).toBe('aladhan');
    expect(e.status).toBe(502);
    expect(e.stale).toBe(true);
    expect(e.message).toBe('oops');
  });

  it('defaults stale to false', () => {
    const e = new ContentFetchError({ source: 'sunnah-com', message: 'x' });
    expect(e.stale).toBe(false);
  });
});

describe('Result helpers', () => {
  it('ok() wraps a value', () => {
    const r = ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBe(42);
  });

  it('err() wraps an error', () => {
    const r = err<number>(new ContentFetchError({ source: 'cache', message: 'nope' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('nope');
  });
});
