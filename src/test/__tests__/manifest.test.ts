/**
 * Manifest validation test
 * Ensures public/manifest.webmanifest contains all required PWA fields.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Web App Manifest', () => {
  let manifest: any;

  beforeAll(() => {
    const manifestPath = resolve(process.cwd(), 'public', 'manifest.webmanifest');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  });

  it('should have a name', () => {
    expect(manifest.name).toBeDefined();
    expect(typeof manifest.name).toBe('string');
    expect(manifest.name.length).toBeGreaterThan(0);
  });

  it('should have a short_name', () => {
    expect(manifest.short_name).toBeDefined();
    expect(typeof manifest.short_name).toBe('string');
  });

  it('should have a start_url', () => {
    expect(manifest.start_url).toBe('/');
  });

  it('should have display set to standalone', () => {
    expect(manifest.display).toBe('standalone');
  });

  it('should have a theme_color', () => {
    expect(manifest.theme_color).toBeDefined();
    expect(/^#[0-9a-f]{6}$/i.test(manifest.theme_color)).toBe(true);
  });

  it('should have a background_color', () => {
    expect(manifest.background_color).toBeDefined();
    expect(/^#[0-9a-f]{6}$/i.test(manifest.background_color)).toBe(true);
  });

  it('should have at least 2 icons', () => {
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  it('should include 192x192 icon', () => {
    const icon192 = manifest.icons.some((icon: any) => icon.sizes.includes('192'));
    expect(icon192).toBe(true);
  });

  it('should include 512x512 icon', () => {
    const icon512 = manifest.icons.some((icon: any) => icon.sizes.includes('512'));
    expect(icon512).toBe(true);
  });

  it('should have lang set to bn', () => {
    expect(manifest.lang).toBe('bn');
  });
});
