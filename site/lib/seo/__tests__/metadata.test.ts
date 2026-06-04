import { describe, expect, it } from 'vitest';
import {
  buildArticleMetadata,
  buildBlogMetadata,
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildCategoryMetadata,
  buildDirectoryMetadata,
  buildFaqPageSchema,
  buildLlmsText,
  buildOrganizationSchema,
  buildPublicSitemapEntries,
  buildRobotsPolicy,
  buildWebSiteSchema,
  buildWebApplicationSchema,
} from '@/lib/seo';
import { getToolBySlug } from '@/data/tools';

describe('public page metadata helpers', () => {
  it('builds English-first metadata for directory pages', () => {
    expect(buildDirectoryMetadata('tools')).toMatchObject({
      title: 'All Tools Directory | toolars',
      description:
        'Browse 73 free calculators and AI tools by category, pricing, and use case.',
      alternates: {
        canonical: '/tools',
      },
    });
  });

  it('builds crawlable category metadata with canonical routes', () => {
    expect(buildCategoryMetadata('health')).toMatchObject({
      title: 'Health Calculators | toolars',
      description:
        'Browse free body, fitness, nutrition, and wellness calculators with no signup required.',
      alternates: {
        canonical: '/categories/health',
      },
    });
  });

  it('builds structured data for calculator pages', () => {
    const tool = getToolBySlug('bmi-calculator');
    expect(tool).toBeDefined();

    expect(buildWebApplicationSchema(tool!)).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'BMI Calculator',
      url: '/tools/bmi-calculator',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });

    expect(
      buildBreadcrumbSchema([
        { name: 'Tools', url: '/tools' },
        { name: 'BMI Calculator', url: '/tools/bmi-calculator' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Tools', item: '/tools' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'BMI Calculator',
          item: '/tools/bmi-calculator',
        },
      ],
    });
  });

  it('builds FAQPage schema from crawlable public content', () => {
    expect(
      buildFaqPageSchema([
        {
          question: 'Do I need an account?',
          answer: 'No. Basic calculator use is free and does not require login.',
        },
      ]),
    ).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need an account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Basic calculator use is free and does not require login.',
          },
        },
      ],
    });
  });

  it('builds English-first blog metadata and article schema', () => {
    expect(buildBlogMetadata()).toMatchObject({
      title: 'Blog | toolars',
      alternates: {
        canonical: '/blog',
      },
    });

    const article = {
      slug: 'free-calculators-ai-tools',
      title: 'How to Use Free Calculators and AI Tools Together',
      description: 'Plan, calculate, and repurpose results with one English-first workflow.',
      publishedAt: '2026-05-31',
      updatedAt: '2026-05-31',
      author: 'toolars editorial',
    };

    expect(buildArticleMetadata(article)).toMatchObject({
      title: 'How to Use Free Calculators and AI Tools Together | toolars',
      alternates: {
        canonical: '/blog/free-calculators-ai-tools',
      },
    });

    expect(buildBlogPostingSchema(article)).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'How to Use Free Calculators and AI Tools Together',
      datePublished: '2026-05-31',
      dateModified: '2026-05-31',
      author: {
        '@type': 'Organization',
        name: 'toolars editorial',
      },
    });
  });

  it('builds a deterministic public sitemap for SEO and GEO discovery', () => {
    const entries = buildPublicSitemapEntries('https://toolars.com');
    const urls = entries.map((entry) => entry.url);

    expect(entries).toHaveLength(88);
    expect(urls).toContain('https://toolars.com/');
    expect(urls).toContain('https://toolars.com/tools');
    expect(urls).toContain('https://toolars.com/tools/bmi-calculator');
    expect(urls).toContain('https://toolars.com/blog/free-calculators-ai-tools');
    expect(urls).toContain('https://toolars.com/pricing');
    expect(urls).toContain('https://toolars.com/privacy');
    expect(urls).toContain('https://toolars.com/terms');
    expect(urls).not.toContain('https://toolars.com/app/repurpose');
    expect(urls).not.toContain('https://toolars.com/login');
    expect(urls).not.toContain('https://toolars.com/register');
  });

  it('builds robots policy for public pages while excluding account and API surfaces', () => {
    expect(buildRobotsPolicy('https://toolars.com')).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/app/', '/login', '/register'],
        },
      ],
      sitemap: 'https://toolars.com/sitemap.xml',
    });
  });

  it('builds llms.txt content that summarizes the public product boundary', () => {
    const text = buildLlmsText('https://toolars.com');

    expect(text).toContain('# toolars');
    expect(text).toContain('73 free calculators');
    expect(text).toContain('AI tools are subscription-gated');
    expect(text).toContain('https://toolars.com/tools/bmi-calculator');
    expect(text).toContain('https://toolars.com/pricing');
    expect(text).toContain('https://toolars.com/terms');
    expect(text).toContain('Anonymous calculator inputs stay local');
  });

  it('builds site-level Organization and WebSite schema for SEO and GEO entity grounding', () => {
    expect(buildOrganizationSchema('https://toolars.com/')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'toolars',
      url: 'https://toolars.com/',
      logo: 'https://toolars.com/favicon.svg',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://toolars.com/contact',
        },
      ],
    });

    expect(buildWebSiteSchema('https://toolars.com/')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'toolars',
      url: 'https://toolars.com/',
      description:
        'Search 73 free calculators and account-based AI tools from one fast utility dashboard.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://toolars.com/tools?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  });
});
