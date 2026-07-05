import { expect, test } from '@playwright/test';

// Regression guard: every internal anchor resolved from the launch surface
// must return a non-404 response. This catches the dead links that previously
// leaked into nav (/pricing, /login, /en, /compare, /categories/body...).
//
// We only follow same-origin absolute paths (starting with "/") and skip
// external URLs, anchors, mailto, and the locale-prefixed paths that ship with
// phase-two i18n routing.

const PAGES_TO_CRAWL = [
  '/',
  '/tools',
  '/ai',
  '/blog',
  '/categories/health',
  '/categories/finance',
];

test.describe('internal links resolve', () => {
  for (const path of PAGES_TO_CRAWL) {
    test(`${path} exposes no dead internal links`, async ({ page, request }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should load`).toBeLessThan(400);

      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
          .map((anchor) => anchor.getAttribute('href') ?? '')
          .filter((href) => href.startsWith('/') && !href.startsWith('//'));
      });

      // De-duplicate.
      const uniqueHrefs = Array.from(new Set(hrefs));
      expect(uniqueHrefs.length, `${path} should expose internal links`).toBeGreaterThan(0);

      const dead: string[] = [];
      for (const href of uniqueHrefs) {
        // Strip query strings and hashes for the status check.
        const cleanPath = href.split(/[?#]/)[0] || '/';
        const probe = await request.get(cleanPath);
        if (probe.status() === 404) {
          dead.push(href);
        }
      }

      expect(dead, `dead links on ${path}: ${dead.join(', ')}`).toEqual([]);
    });
  }
});
