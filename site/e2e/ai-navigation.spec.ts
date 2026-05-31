import { expect, test } from '@playwright/test';

const pages = [
  { label: 'Templates', heading: /template library/i },
  { label: 'Brand Voice', heading: /brand voice/i },
  { label: 'History', heading: /content history/i },
  { label: 'Analytics', heading: /performance analytics/i },
  { label: 'Settings', heading: /workspace settings/i },
] as const;

test.describe('AI app navigation', () => {
  test('keeps the app shell consistent across AI supporting pages', async ({ page }) => {
    await page.goto('/app/repurpose?preview=1');

    for (const target of pages) {
      await page.getByRole('navigation', { name: /ai app navigation/i }).getByRole('link', {
        name: target.label,
      }).click();

      await expect(page.getByRole('heading', { name: target.heading })).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: /ai app navigation/i }),
      ).toBeVisible();
      await expect(page.getByText(/toolars workspace/i)).toBeVisible();
    }
  });
});
