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

  test('exposes sitemap, robots, and llms discovery manifests', async ({ page }) => {
    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain('<loc>https://toolars.com/tools/bmi-calculator</loc>');
    expect(sitemapText).toContain('<loc>https://toolars.com/pricing</loc>');
    expect(sitemapText).not.toContain('/app/repurpose');
    expect(sitemapText).not.toContain('/login');

    const robots = await page.request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    const robotsText = await robots.text();
    expect(robotsText).toContain('Disallow: /api/');
    expect(robotsText).toContain('Disallow: /app/');
    expect(robotsText).toContain('Sitemap: https://toolars.com/sitemap.xml');

    const llms = await page.request.get('/llms.txt');
    expect(llms.ok()).toBe(true);
    const llmsText = await llms.text();
    expect(llmsText).toContain('# toolars');
    expect(llmsText).toContain('73 free calculators');
    expect(llmsText).toContain('AI tools are subscription-gated');
  });
});
