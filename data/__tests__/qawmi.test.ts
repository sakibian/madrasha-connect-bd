import { describe, it, expect } from 'vitest';
import { QAWMI_BOARDS, AL_HAIATUL_ULYA } from '../qawmiBoards';
import { MARHALA_LADDER } from '../marhalaLadder';

describe('QAWMI_BOARDS', () => {
  it('exposes 6 principal boards', () => {
    expect(QAWMI_BOARDS.length).toBe(6);
  });

  it('every board has a unique slug + a source URL', () => {
    const slugs = QAWMI_BOARDS.map(b => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const b of QAWMI_BOARDS) {
      expect(b.sourceUrl).toMatch(/^https?:\/\//);
      expect(b.sourceVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('AL_HAIATUL_ULYA is a distinct national federation entry', () => {
    expect(AL_HAIATUL_ULYA.region).toBe('National');
    expect(AL_HAIATUL_ULYA.foundedYear).toBe(2017);
  });
});

describe('MARHALA_LADDER', () => {
  it('has exactly 6 ordered stages', () => {
    expect(MARHALA_LADDER.length).toBe(6);
    for (let i = 0; i < MARHALA_LADDER.length; i++) {
      expect(MARHALA_LADDER[i].order).toBe(i + 1);
    }
  });

  it('final stage is Dawra-e-Hadith / Takmil', () => {
    expect(MARHALA_LADDER[5].slug).toBe('dawra-e-hadith');
    expect(MARHALA_LADDER[5].mainstreamEquivalent.toLowerCase()).toContain('master');
  });

  it('total duration is at least 15 years', () => {
    const total = MARHALA_LADDER.reduce((s, m) => s + m.durationYears, 0);
    expect(total).toBeGreaterThanOrEqual(15);
  });
});
