import { expect, test } from '@playwright/test';

test.describe('release shell polish', () => {
  test('renders a crawlable footer on public pages', async ({ page }) => {
    await page.goto('/pricing');

    const footer = page.getByRole('contentinfo', { name: /site footer/i });
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { exact: true, name: 'All tools' })).toHaveAttribute(
      'href',
      '/tools',
    );
    await expect(footer.getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/privacy',
    );
    await expect(footer).toContainText(/free calculators, account-gated ai/i);
  });

  test('renders branded recovery content for unknown routes', async ({ page }) => {
    const response = await page.goto('/missing-toolars-route');

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: /we could not find that tool/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('region', { name: /not found recovery/i }).getByRole('link', {
        exact: true,
        name: 'Browse all tools',
      }),
    ).toHaveAttribute(
      'href',
      '/tools',
    );
  });

  test('keeps footer and 404 inside the 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/missing-toolars-route');

    const width = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      viewport: window.innerWidth,
    }));

    expect(width.body).toBeLessThanOrEqual(width.viewport);
  });
});
