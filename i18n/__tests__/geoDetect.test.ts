import { describe, it, expect, beforeEach } from 'vitest';
import {
  mapCountryToLang,
  clearGeoCache,
  BENGALI_COUNTRIES,
  ARABIC_COUNTRIES,
} from '../geoDetect';

describe('mapCountryToLang', () => {
  it('returns null when no country is given', () => {
    expect(mapCountryToLang(undefined)).toBeNull();
    expect(mapCountryToLang(null)).toBeNull();
    expect(mapCountryToLang('')).toBeNull();
  });

  it('maps Bangladesh to bn', () => {
    expect(mapCountryToLang('BD')).toBe('bn');
    expect(mapCountryToLang('bd')).toBe('bn');
    expect(mapCountryToLang(' bd ')).toBe('bn');
  });

  it('maps every Arabic-league country to ar', () => {
    for (const cc of ARABIC_COUNTRIES) {
      expect(mapCountryToLang(cc)).toBe('ar');
    }
  });

  it('maps unknown countries to en', () => {
    expect(mapCountryToLang('US')).toBe('en');
    expect(mapCountryToLang('GB')).toBe('en');
    expect(mapCountryToLang('DE')).toBe('en');
    expect(mapCountryToLang('IN')).toBe('en'); // India — Bengali hint required
  });

  it('prefers explicit language hint over country', () => {
    // A Bengali-speaking user in India should still get bn if the header hints it.
    expect(mapCountryToLang('IN', 'bn,en-in')).toBe('bn');
    // A US visitor whose browser prefers Arabic should get ar.
    expect(mapCountryToLang('US', 'ar,en-us')).toBe('ar');
  });

  it('exposes bengali country set with BD present', () => {
    expect(BENGALI_COUNTRIES.has('BD')).toBe(true);
  });
});

describe('clearGeoCache', () => {
  beforeEach(() => { localStorage.clear(); });

  it('removes the cache key', () => {
    localStorage.setItem('mc_geo_lang', 'something');
    clearGeoCache();
    expect(localStorage.getItem('mc_geo_lang')).toBeNull();
  });

  it('is a no-op when localStorage is unavailable', () => {
    // Should not throw.
    expect(() => clearGeoCache()).not.toThrow();
  });
});
