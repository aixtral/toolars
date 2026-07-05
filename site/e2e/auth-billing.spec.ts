import { expect, test } from '@playwright/test';

// v1: the AI paywall is disabled — every logged-in plan (free, pro, team) can
// generate. These specs assert the free path now succeeds instead of showing
// an upgrade prompt. The /login and /register links are intentionally removed
// from AuthGate until Supabase auth lands in phase-four.
test.describe('auth and workspace gates', () => {
  test('keeps AI app gated for anonymous visitors', async ({ page }) => {
    await page.goto('/app/repurpose');

    await expect(
      page.getByRole('heading', { name: /sign in to use ai content repurposer/i }),
    ).toBeVisible();
    await expect(page.getByText(/public calculators stay free/i)).toBeVisible();
  });

  test('lets free preview users generate AI output without an upgrade prompt', async ({
    page,
  }) => {
    await page.goto('/app/repurpose?preview=free');

    await page.getByLabel(/source text/i).fill(
      'toolars turns calculators and AI repurposing into one operator-friendly workspace.',
    );
    await page.getByRole('button', { name: /generate/i }).click();

    // v1: no paywall — generation streams instead of surfacing "Upgrade to Pro".
    await expect(page.getByRole('status')).toContainText(/streaming outputs/i);
    await expect(
      page.getByRole('region', { name: /generated outputs/i }).getByRole('heading', {
        name: /twitter thread/i,
      }),
    ).toBeVisible();
  });

  test('lets Pro preview users generate AI output', async ({ page }) => {
    await page.goto('/app/repurpose?preview=pro');

    await page.getByLabel(/source text/i).fill(
      'toolars turns calculators and AI repurposing into one operator-friendly workspace.',
    );
    await page.getByRole('button', { name: /generate/i }).click();

    await expect(page.getByRole('status')).toContainText(/streaming outputs/i);
    await expect(
      page.getByRole('region', { name: /generated outputs/i }).getByRole('heading', {
        name: /twitter thread/i,
      }),
    ).toBeVisible();
  });
});
