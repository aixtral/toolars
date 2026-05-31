import { expect, test } from '@playwright/test';

const publicPages = [
  {
    path: '/',
    heading: /search 73 calculators and ai tools/i,
    checks: [/Recent Tools/i, /Favorites/i, /Quick Actions/i],
  },
  {
    path: '/tools',
    heading: /all tools directory/i,
    checks: [/Favorites and Recently Used/i, /Health & Wellness/i, /Mortgage Calculator/i],
  },
  {
    path: '/categories/health',
    heading: /health calculators/i,
    checks: [/Body/i, /Fitness & Nutrition/i, /Wellness/i],
  },
  {
    path: '/categories/finance',
    heading: /finance calculators/i,
    checks: [/Debt Payoff Calculator/i, /Mortgage Calculator/i, /Popular searches/i],
  },
  {
    path: '/ai',
    heading: /ai tools directory/i,
    checks: [/AI Content Repurposer/i, /Platform support/i, /Usage plan/i],
  },
];

test.describe('public discovery pages', () => {
  for (const pageSpec of publicPages) {
    test(`${pageSpec.path} renders crawlable discovery content`, async ({ page }) => {
      await page.goto(pageSpec.path);

      await expect(page.getByRole('heading', { name: pageSpec.heading })).toBeVisible();
      for (const check of pageSpec.checks) {
        await expect(page.getByText(check).first()).toBeVisible();
      }
    });
  }

  test('keeps the tools directory inside the 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/tools');

    const width = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      viewport: window.innerWidth,
    }));

    expect(width.body).toBeLessThanOrEqual(width.viewport);
  });
});
