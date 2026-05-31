import { describe, expect, it } from 'vitest';
import { buildCategoryMetadata, buildDirectoryMetadata } from '@/lib/seo';

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
});
