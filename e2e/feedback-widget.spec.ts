import { test, expect } from '@playwright/test';

/**
 * Community feedback widget — smoke test.
 *
 * The floating "ফিডব্যাক" button is mounted globally on the app (Shell in
 * App.tsx). We only render it inside the logged-in Shell, but the widget
 * itself doesn't require auth to submit. This test focuses on visibility
 * and the modal's structure rather than a live network round-trip
 * (which would need a working Supabase URL in CI).
 *
 * If the button is NOT visible on the landing page (e.g. because the app
 * shows the marketing LandingPage before the Shell mounts), we navigate to
 * /faq — a public route inside the Shell where the widget is guaranteed.
 */

test.describe('Community feedback widget', () => {
  test('feedback trigger opens the modal with all category options', async ({ page }) => {
    await page.goto('/faq');

    const trigger = page.getByRole('button', { name: /ফিডব্যাক পাঠান/i });
    // If the trigger is not immediately visible (routing detail), fall back
    // to any route inside the Shell.
    if (!(await trigger.isVisible().catch(() => false))) {
      await page.goto('/institutions');
    }

    const openTrigger = page.getByRole('button', { name: /ফিডব্যাক পাঠান/i });
    await expect(openTrigger).toBeVisible({ timeout: 10000 });
    await openTrigger.click();

    // Modal appears with the expected heading and category chips.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/আপনার মতামত পাঠান/)).toBeVisible();

    // Each category chip should be present.
    for (const label of ['কিছু ভেঙে গেছে', 'নতুন আইডিয়া', 'কন্টেন্ট', 'সাদাকাহ', 'অন্যান্য']) {
      await expect(dialog.getByText(new RegExp(label))).toBeVisible();
    }

    // Message textarea should be reachable by its label.
    await expect(dialog.getByLabel(/Message/i)).toBeVisible();
  });

  test('submit is disabled until 3+ characters are typed', async ({ page }) => {
    await page.goto('/faq');
    let trigger = page.getByRole('button', { name: /ফিডব্যাক পাঠান/i });
    if (!(await trigger.isVisible().catch(() => false))) {
      await page.goto('/institutions');
      trigger = page.getByRole('button', { name: /ফিডব্যাক পাঠান/i });
    }
    await trigger.click();

    const submit = page.getByRole('button', { name: /^পাঠান$/ });
    await expect(submit).toBeDisabled();

    await page.getByLabel(/Message/i).fill('ছোট');
    // Still ≥ 3 chars now, so it should enable.
    await expect(submit).toBeEnabled();
  });
});
