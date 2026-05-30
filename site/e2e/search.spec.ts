import { expect, test } from '@playwright/test';

test.describe('command palette search', () => {
  test('opens with keyboard shortcut and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('searchbox', { name: /search tools/i }).first();

    await trigger.click();
    const dialog = page.getByRole('dialog', { name: /search tools/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await page.keyboard.press('Control+K');

    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('searchbox', { name: /search 73 calculators and ai tools/i }),
    ).toBeFocused();

    await page.keyboard.type('mortgage payment');
    await expect(dialog.getByRole('link', { name: /mortgage calculator/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
