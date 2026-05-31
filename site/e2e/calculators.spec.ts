import { expect, test } from '@playwright/test';

test.describe('calculator pages', () => {
  test('run an anonymous calculate, save, compare, and share flow', async ({ page }) => {
    await page.goto('/tools/bmi-calculator');

    await expect(
      page.getByRole('heading', { name: /bmi calculator/i }),
    ).toBeVisible();
    await expect(page.getByText(/calculators stay free and private/i)).toBeVisible();

    await page.getByLabel(/height/i).fill('180');
    await page.getByLabel(/weight/i).fill('75');
    await page.getByRole('button', { name: /calculate/i }).click();

    const resultPanel = page.getByRole('region', { name: /result/i });
    await expect(resultPanel.getByText('23.1')).toBeVisible();
    await expect(resultPanel.getByText(/normal/i)).toBeVisible();

    await page.getByRole('button', { name: /save result/i }).click();
    await expect(page.getByRole('status')).toContainText(/saved locally/i);

    await page.getByRole('button', { name: /add to compare/i }).click();
    await expect(page.getByRole('status')).toContainText(/added to compare/i);

    await page.getByRole('button', { name: /copy share link/i }).click();
    await expect(page.getByRole('status')).toContainText(/share link copied/i);

    const savedCount = await page.evaluate(() => {
      const saved = window.localStorage.getItem('toolars:saved-calculator-results');
      return saved ? JSON.parse(saved).length : 0;
    });
    expect(savedCount).toBe(1);
  });
});
