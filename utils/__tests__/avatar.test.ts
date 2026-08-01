import { describe, it, expect } from 'vitest';
import {
  inferGenderFromName,
  getAvatarPalette,
  getAvatarStyleFromName,
  isRealPhotoUrl,
} from '../avatar';

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

describe('getAvatarPalette', () => {
  it('returns 5-colour arrays for every gender', () => {
    expect(getAvatarPalette('male')).toHaveLength(5);
    expect(getAvatarPalette('female')).toHaveLength(5);
    expect(getAvatarPalette('unknown')).toHaveLength(5);
  });

  it('picks the bd-green tone for masculine names', () => {
    const male = getAvatarPalette('male');
    expect(male).toContain('#006a4e'); // bd-green national colour
  });

  it('picks a warmer distinct palette for female', () => {
    const female = getAvatarPalette('female');
    expect(female).not.toEqual(getAvatarPalette('male'));
  });
});

describe('getAvatarStyleFromName', () => {
  it('bundles gender inference + palette in one call', () => {
    const male = getAvatarStyleFromName('Abdullah Ahmed');
    expect(male.gender).toBe('male');
    expect(male.colors[0]).toBe('#006a4e');

    const female = getAvatarStyleFromName('Aisha Sultana');
    expect(female.gender).toBe('female');
    expect(female.colors).not.toEqual(male.colors);

    const unknown = getAvatarStyleFromName('Team X');
    expect(unknown.gender).toBe('unknown');
  });
});

describe('isRealPhotoUrl', () => {
  it('accepts real uploaded photos', () => {
    expect(isRealPhotoUrl('https://cdn.example.com/user.jpg')).toBe(true);
    expect(isRealPhotoUrl('https://mysupabase.co/storage/v1/xyz.png')).toBe(true);
  });

  it('rejects legacy dicebear URLs', () => {
    expect(isRealPhotoUrl('https://api.dicebear.com/7.x/avataaars/svg?seed=x')).toBe(false);
  });

  it('rejects picsum stub URLs', () => {
    expect(isRealPhotoUrl('https://picsum.photos/seed/user/100/100')).toBe(false);
  });

  it('rejects empty / undefined values', () => {
    expect(isRealPhotoUrl(undefined)).toBe(false);
    expect(isRealPhotoUrl(null)).toBe(false);
    expect(isRealPhotoUrl('')).toBe(false);
  });
});
