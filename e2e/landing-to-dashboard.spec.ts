import { test, expect } from '@playwright/test';

test.describe('Landing → Login → Dashboard flow', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Madrasa Connect|ইসলামিকবাংলাদেশ|মাদ্রাসা/);
  });

  test('navigation to login page works', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button, input')).toHaveCount(1, { timeout: 5000 });
  });

  test('public pages are accessible', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL(/\/jobs/);

    await page.goto('/fatwa');
    await expect(page).toHaveURL(/\/fatwa/);

    await page.goto('/institutions');
    await expect(page).toHaveURL(/\/institutions/);
  });
});
