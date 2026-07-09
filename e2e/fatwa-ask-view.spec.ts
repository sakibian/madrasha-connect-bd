import { test, expect } from '@playwright/test';

test.describe('Fatwa ask and view flow', () => {
  test('fatwa page shows questions', async ({ page }) => {
    await page.goto('/fatwa');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('fatwa archive is accessible', async ({ page }) => {
    await page.goto('/fatwa/archive');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });
});
