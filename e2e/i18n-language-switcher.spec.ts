import { test, expect } from '@playwright/test';

/**
 * Language switcher — verifies that changing language:
 *   1. Updates <html lang="..."> immediately
 *   2. Flips <html dir="rtl"> when Arabic is picked
 *   3. Persists the preference across page reloads (via localStorage)
 *
 * This exercises the useI18nSideEffects hook end-to-end.
 */

test.describe('i18n language switcher', () => {
  test('defaults to Bengali (bn) on first visit', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'bn', { timeout: 5000 });
    await expect(html).toHaveAttribute('dir', 'ltr');
  });

  test('switching to Arabic sets dir=rtl', async ({ page }) => {
    await page.goto('/?lang=ar');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar', { timeout: 5000 });
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('switching to English keeps ltr', async ({ page }) => {
    await page.goto('/?lang=en');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en', { timeout: 5000 });
    await expect(html).toHaveAttribute('dir', 'ltr');
  });

  test('language preference persists via localStorage', async ({ page, context }) => {
    await page.goto('/?lang=ar');
    // Now navigate WITHOUT the query param — detector should pick up localStorage.
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar', { timeout: 5000 });
  });
});
