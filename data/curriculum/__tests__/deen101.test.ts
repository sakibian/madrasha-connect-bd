import { describe, it, expect } from 'vitest';
import { DEEN101_LESSONS, DEEN101_TOTAL_XP } from '../deen101';

describe('DEEN101_LESSONS', () => {
  it('has exactly 30 sequential days', () => {
    expect(DEEN101_LESSONS.length).toBe(30);
    for (let i = 0; i < DEEN101_LESSONS.length; i++) {
      expect(DEEN101_LESSONS[i].day).toBe(i + 1);
    }
  });

  it('every lesson has a source name + license + unique slug', () => {
    const slugs = new Set<string>();
    for (const l of DEEN101_LESSONS) {
      expect(l.sourceName.length).toBeGreaterThan(0);
      expect(l.license).toBeDefined();
      expect(slugs.has(l.slug)).toBe(false);
      slugs.add(l.slug);
    }
  });

  it('total XP is at least 300 (10 XP baseline × 30 days)', () => {
    expect(DEEN101_TOTAL_XP).toBeGreaterThanOrEqual(300);
  });
});
