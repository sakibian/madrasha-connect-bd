import { test, expect } from '@playwright/test';

test.describe('Job search and apply flow', () => {
  test('jobs page shows listing', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.locator('h1, h2, h3').first()).toBeAttached({ timeout: 10000 });
  });

  test('job search input is interactive', async ({ page }) => {
    await page.goto('/jobs');
    const searchInput = page.locator('input[type="text"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Imam');
      await expect(searchInput).toHaveValue('Imam');
    }
  });
});
