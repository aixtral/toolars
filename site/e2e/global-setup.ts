import { type FullConfig } from '@playwright/test';

/**
 * Warm up the Next.js dev server before the parallel test workers start.
 *
 * `next dev` compiles routes lazily on first request. With fullyParallel
 * enabled, nine workers hit different routes at once during a cold compile
 * and `next dev` transiently returns 500 ("Internal Server Error") while the
 * routes are still building. The webServer `url` check only confirms the root
 * responds, so the rest of the graph is uncompiled when tests begin.
 *
 * This global setup sequentially GETs every route the specs touch so the
 * compiled output is cached before workers fork. It is a no-op once the
 * server is warm.
 */
const ROUTES_TO_WARM = [
  '/',
  '/tools',
  '/ai',
  '/blog',
  '/blog/free-calculators-ai-tools',
  '/categories/health',
  '/categories/finance',
  '/tools/bmi-calculator',
  '/app/repurpose',
  '/app/repurpose?preview=1',
  '/login',
];

export default async function globalSetup(_config: FullConfig) {
  const base = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:9088';
  for (const route of ROUTES_TO_WARM) {
    // Retry each route a few times: cold compiles can take several seconds
    // and the first hit may return a transient 500 while the route builds.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await fetch(`${base}${route}`, { redirect: 'follow' });
        if (res.status < 500) break;
      } catch {
        // Server might still be starting; retry shortly.
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
