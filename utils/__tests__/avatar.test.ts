import { describe, it, expect } from 'vitest';
import { inferGenderFromName, getGenderedAvatarUrl } from '../avatar';

describe('inferGenderFromName', () => {
  it('detects common Bangla male tokens', () => {
    expect(inferGenderFromName('আব্দুল্লাহ আহমেদ')).toBe('male');
    expect(inferGenderFromName('মুফতি রহিম উদ্দিন')).toBe('male');
    expect(inferGenderFromName('মো. করিম')).toBe('male');
  });

  it('detects common Bangla female tokens', () => {
    expect(inferGenderFromName('আয়েশা খাতুন')).toBe('female');
    expect(inferGenderFromName('মোছাঃ সালমা বেগম')).toBe('female');
    expect(inferGenderFromName('ফাতেমা আক্তার')).toBe('female');
  });

  it('detects romanised male + female names', () => {
    expect(inferGenderFromName('Muhammad Abdullah')).toBe('male');
    expect(inferGenderFromName('Abu Bakr Siddique')).toBe('male');
    expect(inferGenderFromName('Aisha Rahman')).toBe('female');
    expect(inferGenderFromName('Khadija Sultana')).toBe('female');
  });

  it('returns unknown for gender-neutral or empty strings', () => {
    expect(inferGenderFromName('')).toBe('unknown');
    expect(inferGenderFromName(undefined)).toBe('unknown');
    expect(inferGenderFromName('Team Deen101')).toBe('unknown');
  });
});

describe('getGenderedAvatarUrl', () => {
  it('pins short-hair top for male names', () => {
    const url = getGenderedAvatarUrl('Abdullah Ahmed');
    expect(url).toContain('top=shortHair');
    expect(url).not.toContain('hijab');
  });

  it('pins hijab top for female names', () => {
    const url = getGenderedAvatarUrl('Aisha Sultana');
    expect(url).toContain('top=hijab');
    expect(url).toContain('facialHairProbability=0');
  });

  it('respects a real uploaded photo URL', () => {
    const real = 'https://cdn.example.com/photo.jpg';
    expect(getGenderedAvatarUrl('Anyone', real)).toBe(real);
  });

  it('falls back to a neutral dicebear seed when gender is unknown', () => {
    const url = getGenderedAvatarUrl('Team Deen101');
    expect(url).toContain('dicebear.com');
    expect(url).not.toContain('top=hijab');
    expect(url).not.toContain('top=shortHair');
  });
});
