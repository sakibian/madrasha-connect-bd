import { describe, it, expect } from 'vitest';
import { ayahAudioUrl } from '../quran';

describe('ayahAudioUrl', () => {
  it('builds a valid CDN URL with default reciter + bitrate', () => {
    const url = ayahAudioUrl(1);
    expect(url).toBe('https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3');
  });

  it('honours a custom reciter edition and bitrate', () => {
    const url = ayahAudioUrl(255, 'ar.abdulbasitmurattal', 64);
    expect(url).toBe('https://cdn.islamic.network/quran/audio/64/ar.abdulbasitmurattal/255.mp3');
  });
});
