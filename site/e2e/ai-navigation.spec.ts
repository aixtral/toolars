import { expect, test } from '@playwright/test';

const pages = [
  {
    label: 'Templates',
    heading: /template library/i,
    region: /template workspace/i,
    action: /use launch thread template/i,
  },
  {
    label: 'Brand Voice',
    heading: /brand voice/i,
    region: /voice governance/i,
    action: /set as default/i,
  },
  {
    label: 'History',
    heading: /content history/i,
    region: /history operations/i,
    action: /filter by status/i,
  },
  {
    label: 'Analytics',
    heading: /performance analytics/i,
    region: /analytics cockpit/i,
    action: /usage trend/i,
  },
  {
    label: 'Settings',
    heading: /workspace settings/i,
    region: /settings operations/i,
    action: /export workspace data/i,
  },
] as const;

test.describe('AI app navigation', () => {
  test('keeps the app shell consistent across AI supporting pages', async ({ page }) => {
    await page.goto('/app/repurpose?preview=1');

    for (const target of pages) {
      await page.getByRole('navigation', { name: /ai app navigation/i }).getByRole('link', {
        name: target.label,
      }).click();

      await expect(page.getByRole('heading', { name: target.heading })).toBeVisible();
      await expect(page.getByRole('region', { name: target.region })).toBeVisible();
      await expect(
        target.label === 'Analytics'
          ? page.getByRole('region', { name: target.action })
          : page.getByRole('button', { name: target.action }).first(),
      ).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: /ai app navigation/i }),
      ).toBeVisible();
      await expect(page.getByText(/toolars workspace/i)).toBeVisible();
    }
  });

  test('keeps AI support pages inside the mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/app/settings?preview=1');

    await expect(page.getByRole('heading', { name: /workspace settings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /export workspace data/i })).toBeVisible();

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
  });
});
