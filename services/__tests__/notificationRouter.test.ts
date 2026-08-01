import { describe, it, expect } from 'vitest';
import { handleNotificationClick } from '../notificationRouter';

describe('handleNotificationClick', () => {
  it('returns / when link is empty', () => {
    expect(handleNotificationClick()).toBe('/');
    expect(handleNotificationClick('')).toBe('/');
  });

  it('returns absolute paths untouched', () => {
    expect(handleNotificationClick('/fatwa/123')).toBe('/fatwa/123');
    expect(handleNotificationClick('/dashboard?tab=jobs')).toBe('/dashboard?tab=jobs');
  });

  it('strips origin from same-origin absolute URLs', () => {
    const url = `${window.location.origin}/institutions/999`;
    expect(handleNotificationClick(url)).toBe('/institutions/999');
  });

  it('returns cross-origin URLs unchanged', () => {
    const url = 'https://example.com/foo';
    expect(handleNotificationClick(url)).toBe(url);
  });

  it('prefixes bare paths with a slash', () => {
    expect(handleNotificationClick('some/path')).toBe('/some/path');
  });
});
