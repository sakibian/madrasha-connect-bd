import { describe, it, expect } from 'vitest';
import { cacheKey } from '../cache';

describe('cacheKey', () => {
  it('builds a deterministic key without params', () => {
    expect(cacheKey('aladhan', 'timings')).toBe('aladhan:timings');
  });

  it('sorts params so equivalent calls produce the same key', () => {
    const a = cacheKey('aladhan', 'timings', { city: 'Dhaka', country: 'BD', method: 3 });
    const b = cacheKey('aladhan', 'timings', { method: 3, country: 'BD', city: 'Dhaka' });
    expect(a).toBe(b);
    expect(a).toContain('city=Dhaka');
    expect(a).toContain('country=BD');
    expect(a).toContain('method=3');
  });

  it('drops empty / undefined params from the key', () => {
    const k = cacheKey('aladhan', 'timings', { city: 'Dhaka', country: '', method: undefined });
    expect(k).toBe('aladhan:timings?city=Dhaka');
  });

  it('URL-encodes values that contain reserved characters', () => {
    const k = cacheKey('alquran-cloud', 'surah', { edition: 'bn.bengali & en.sahih' });
    expect(k).toContain('edition=bn.bengali%20%26%20en.sahih');
  });
});
