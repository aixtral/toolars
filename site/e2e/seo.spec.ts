import { expect, test } from '@playwright/test';

async function canonicalHref(page: import('@playwright/test').Page) {
  return page.locator('link[rel="canonical"]').first().getAttribute('href');
}

test.describe('SEO content surfaces', () => {
  test('renders a crawlable blog index with English-first article links', async ({ page }) => {
    await page.goto('/blog');

    await expect(page.getByRole('heading', { name: /toolars blog/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /how to use free calculators and ai tools together/i })).toBeVisible();
    await expect(canonicalHref(page)).resolves.toContain('/blog');
  });

  test('renders article metadata, breadcrumbs, and JSON-LD', async ({ page }) => {
    await page.goto('/blog/free-calculators-ai-tools');

    await expect(
      page.getByRole('heading', { name: /how to use free calculators and ai tools together/i }),
    ).toBeVisible();
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toContainText('Blog');
    await expect(canonicalHref(page)).resolves.toContain('/blog/free-calculators-ai-tools');

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ''));

    expect(jsonLd.some((entry) => entry.includes('"@type":"BlogPosting"'))).toBe(true);
    expect(jsonLd.some((entry) => entry.includes('"@type":"BreadcrumbList"'))).toBe(true);
  });

  test('exposes calculator structured data on public tool pages', async ({ page }) => {
    await page.goto('/tools/bmi-calculator');

    await expect(page.getByRole('heading', { name: /bmi calculator/i })).toBeVisible();

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ''));

    expect(jsonLd.some((entry) => entry.includes('"@type":"WebApplication"'))).toBe(true);
    expect(jsonLd.some((entry) => entry.includes('"@type":"FAQPage"'))).toBe(true);
  });
});
