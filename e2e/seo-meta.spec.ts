import { test, expect } from '@playwright/test';

/**
 * SEO / AEO surface smoke test.
 *
 * Verifies that the essential SEO infrastructure emits real markup:
 *   - Canonical URL
 *   - hreflang alternates for bn/en/ar + x-default
 *   - Open Graph tags
 *   - Organization + WebSite JSON-LD
 *   - robots.txt served
 *   - sitemap.xml served
 *   - llms.txt served
 *
 * These directly affect how well we rank in Google, Bing, and how AI
 * answer engines (ChatGPT, Perplexity, Claude) cite the platform.
 */

test.describe('SEO / AEO infrastructure', () => {
  test('home page emits canonical + hreflang + OG tags', async ({ page }) => {
    await page.goto('/');

    // Canonical
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();

    // hreflang: bn, en, ar, x-default (at least one of each)
    for (const lang of ['bn', 'en', 'ar', 'x-default']) {
      const link = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
      await expect(link).toHaveCount(1);
    }

    // Open Graph essentials
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(1);

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);

    // JSON-LD (at least one script)
    const ldScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(ldScripts.length).toBeGreaterThanOrEqual(1);

    // Parse the first payload and confirm it's schema.org shaped.
    const first = await ldScripts[0].textContent();
    expect(first).toBeTruthy();
    const parsed = JSON.parse(first!);
    expect(parsed['@context']).toBe('https://schema.org');
  });

  test('robots.txt is served and permits crawlers + points to sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
    // AEO-friendliness: explicitly allow GPTBot / ClaudeBot / PerplexityBot.
    expect(body).toMatch(/GPTBot/);
    expect(body).toMatch(/ClaudeBot/);
    expect(body).toMatch(/PerplexityBot/);
  });

  test('sitemap.xml is valid XML with hreflang alternates', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('xhtml:link');
    expect(body).toContain('hreflang');
  });

  test('llms.txt is served with attribution guidance', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.toLowerCase()).toContain('madrasa connect');
    expect(body.toLowerCase()).toContain('attribute');
  });
});
