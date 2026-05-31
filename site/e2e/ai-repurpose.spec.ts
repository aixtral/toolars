import { expect, test } from '@playwright/test';

test.describe('AI repurpose workflow', () => {
  test('prompts unauthenticated visitors to sign in', async ({ page }) => {
    await page.goto('/app/repurpose');

    await expect(
      page.getByRole('heading', { name: /sign in to use ai content repurposer/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('main').getByRole('link', { name: /^sign in$/i }),
    ).toBeVisible();
  });

  test('generates streaming outputs and can cancel the job', async ({ page }) => {
    await page.goto('/app/repurpose?preview=1');

    await expect(
      page.getByRole('heading', { name: /ai content repurposer/i }),
    ).toBeVisible();
    await expect(page.getByRole('region', { name: /ai workspace header/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /usage limits/i })).toContainText(
      /ai generations left/i,
    );
    await expect(
      page.getByRole('region', { name: /ai repurpose workspace/i }),
    ).toBeVisible();
    await expect(page.getByRole('tablist', { name: /source type/i })).toBeVisible();
    await expect(page.getByRole('group', { name: /platform picker/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /generation controls/i })).toContainText(
      /toolars fast/i,
    );
    await expect(
      page.getByRole('region', { name: /history and saved outputs/i }),
    ).toContainText(/local draft history/i);
    await page.getByLabel(/source text/i).fill(
      'toolars helps operators move from a useful calculator to an AI workflow without losing focus.',
    );

    await page.getByRole('button', { name: /generate/i }).click();

    await expect(page.getByRole('status')).toContainText(/streaming outputs/i);
    const outputs = page.getByRole('region', { name: /generated outputs/i });
    await expect(
      outputs.getByRole('heading', { name: /twitter thread/i }),
    ).toBeVisible();

    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('status')).toContainText(/canceled/i);
    await expect(outputs.getByText(/drafting twitter thread/i)).toBeVisible();
  });
});
