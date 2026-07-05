import type { MetadataRoute } from 'next';
import { LAUNCH_LOCALES } from '@/i18n/routing';
import { APPROVED_CALCULATOR_SLUGS } from '@/data/calculators';
import { BLOG_ARTICLES } from '@/data/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:9088';

/**
 * Global sitemap covering every launch locale x public route.
 *
 * Static directory pages, calculator detail pages (73), and blog articles
 * are all emitted per locale. Account-only and auth routes (/app, /login,
 * /register, /auth) are intentionally excluded — see app/robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '/',
    '/tools',
    '/ai',
    '/blog',
    '/categories/health',
    '/categories/finance',
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LAUNCH_LOCALES) {
    const prefix = `/${locale}`;
    // static pages
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}${prefix}${path === '/' ? '' : path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.8,
      });
    }
    // calculator detail pages (73)
    for (const slug of APPROVED_CALCULATOR_SLUGS) {
      entries.push({
        url: `${BASE_URL}${prefix}/tools/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    // blog articles
    for (const article of BLOG_ARTICLES) {
      entries.push({
        url: `${BASE_URL}${prefix}/blog/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
