import { expect, test } from '@playwright/test';

test.describe('auth and billing gates', () => {
  test('keeps AI app gated for anonymous visitors', async ({ page }) => {
    await page.goto('/app/repurpose');

    await expect(
      page.getByRole('heading', { name: /sign in to use ai content repurposer/i }),
    ).toBeVisible();
    await expect(page.getByText(/public calculators stay free/i)).toBeVisible();
  });

  test('blocks free preview users from paid AI generation with an upgrade path', async ({ page }) => {
    await page.goto('/app/repurpose?preview=free');

    await expect(page.getByRole('heading', { name: /^free$/i })).toBeVisible();
    await page.getByLabel(/source text/i).fill(
      'toolars turns calculators and AI repurposing into one operator-friendly workspace.',
    );
    await page.getByRole('button', { name: /generate/i }).click();

    await expect(page.getByRole('heading', { name: /upgrade to pro/i })).toBeVisible();
    await expect(page.getByRole('status')).toContainText(/requires a pro subscription/i);
  });

  test('allows Pro preview users to generate and exposes Pro capabilities', async ({ page }) => {
    await page.goto('/app/repurpose?preview=pro');

    await expect(page.getByRole('heading', { name: /^pro$/i })).toBeVisible();
    await expect(page.getByText(/PDF and CSV exports/i)).toBeVisible();
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
