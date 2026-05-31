import { describe, expect, it } from 'vitest';
import {
  buildArticleMetadata,
  buildBlogMetadata,
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildCategoryMetadata,
  buildDirectoryMetadata,
  buildFaqPageSchema,
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
});
