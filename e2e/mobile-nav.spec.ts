import { test, expect, devices } from '@playwright/test';

// Emulate an iPhone SE — the smallest common modern viewport (375 × 667).
test.use({ ...devices['iPhone SE'] });

test.describe('Mobile navigation', () => {
  test('renders the bottom nav on mobile viewport', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByTestId('bottom-nav');
    await expect(nav).toBeVisible();
    // 5 tabs
    const items = nav.locator('li');
    await expect(items).toHaveCount(5);
  });

  test('bottom nav is hidden on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const nav = page.getByTestId('bottom-nav');
    // Element exists in DOM (md:hidden is a class) but is not visible.
    await expect(nav).toBeHidden();
  });

  test('tapping the Ask tab routes to the fatwa center', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Ask/i }).click();
    await expect(page).toHaveURL(/\/fatwa/);
  });

  test('feedback widget sits above the bottom nav on mobile', async ({ page }) => {
    await page.goto('/');
    const widget = page.getByRole('button', { name: /Feedback|Report/i }).first();
    await expect(widget).toBeVisible();
    const widgetBox = await widget.boundingBox();
    const nav = page.getByTestId('bottom-nav');
    const navBox = await nav.boundingBox();
    if (widgetBox && navBox) {
      // Bottom of widget must be above the top of the bottom-nav.
      expect(widgetBox.y + widgetBox.height).toBeLessThanOrEqual(navBox.y + 1);
    }
  });
});
