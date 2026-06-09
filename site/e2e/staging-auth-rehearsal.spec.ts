import { expect, test } from '@playwright/test';

const runRehearsal = process.env.TOOLARS_RUN_STAGING_AUTH_REHEARSAL === 'true';
const requiredEnv = [
  'TOOLARS_STAGING_BASE_URL',
  'TOOLARS_STAGING_TEST_EMAIL',
  'TOOLARS_STAGING_TEST_PASSWORD',
] as const;
const missingEnv = requiredEnv.filter((key) => !process.env[key]?.trim());

test.describe('Supabase auth staging rehearsal', () => {
  test.skip(
    !runRehearsal,
    'Set TOOLARS_RUN_STAGING_AUTH_REHEARSAL=true to run against staging.',
  );
  test.skip(
    missingEnv.length > 0,
    `Missing staging rehearsal env: ${missingEnv.join(', ')}`,
  );

  test('redirects anonymous app visitors to login on staging', async ({ page }) => {
    await page.goto('/app/repurpose');

    await expect(page).toHaveURL(/\/login\?next=%2Fapp%2Frepurpose/);
    await expect(page.getByRole('heading', { name: /sign in to toolars/i })).toBeVisible();
  });

  test('signs in with a real Supabase test account and renders the AI workspace', async ({
    page,
  }) => {
    await page.goto('/login?next=/app/repurpose');
    await page.getByLabel(/^email$/i).fill(process.env.TOOLARS_STAGING_TEST_EMAIL ?? '');
    await page
      .getByLabel(/^password$/i)
      .fill(process.env.TOOLARS_STAGING_TEST_PASSWORD ?? '');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page).toHaveURL(/\/app\/repurpose/);
    await expect(page.getByRole('region', { name: /ai workspace header/i })).toContainText(
      /ai content repurposer/i,
    );
    await expect(page.getByRole('heading', { name: /sign in to use ai/i })).toHaveCount(0);
  });
});
