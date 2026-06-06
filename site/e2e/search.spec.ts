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

test.describe('tools directory query search', () => {
  test('renders a shareable query search result on the tools directory', async ({ page }) => {
    await page.goto('/tools?search=inflation');

    await expect(page.getByRole('heading', { name: /all tools directory/i })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: /search all tools/i })).toHaveValue(
      'inflation',
    );
    await expect(page.getByText(/showing results for "inflation"/i)).toBeVisible();

    const toolGrid = page.locator('#tool-grid');
    await expect(toolGrid.getByRole('link', { name: /inflation calculator/i })).toBeVisible();
    await expect(toolGrid.getByRole('link', { name: /bmi calculator/i })).toHaveCount(0);
  });

  test('renders an explicit empty state when query search has no matches', async ({ page }) => {
    await page.goto('/tools?search=definitely-not-a-tool');

    await expect(page.getByRole('searchbox', { name: /search all tools/i })).toHaveValue(
      'definitely-not-a-tool',
    );
    await expect(page.getByText(/no tools found for "definitely-not-a-tool"/i)).toBeVisible();
    await expect(page.locator('#tool-grid').getByRole('link')).toHaveCount(0);
  });
});
