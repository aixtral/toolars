import { defineRouting } from 'next-intl/routing';

/**
 * Launch locales for toolars v1.
 *
 * English is the default and served at the root path ("/"). The other launch
 * locales (zh, es, pt) are path-prefixed ("/zh", "/es", "/pt"). Locales marked
 * phase-two in data/locales.ts (fr, ja, ru, ar, hi, zh-tw) are intentionally
 * NOT routable yet — they will be added here when their translations ship.
 */
export const LAUNCH_LOCALES = ['en', 'zh', 'es', 'pt'] as const;
export type LaunchLocale = (typeof LAUNCH_LOCALES)[number];

export const routing = defineRouting({
  locales: [...LAUNCH_LOCALES],
  defaultLocale: 'en',
  localePrefix: 'always',
});
