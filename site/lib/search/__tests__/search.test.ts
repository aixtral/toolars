import { describe, expect, it } from 'vitest';
import { searchTools } from '@/lib/search';

describe('searchTools', () => {
  it('finds calculators by title, keyword, and phrase', () => {
    expect(searchTools('body mass index')[0]?.slug).toBe('bmi-calculator');
    expect(searchTools('mortgage payment')[0]?.slug).toBe('mortgage-calculator');
    expect(searchTools('annual yield')[0]?.slug).toBe('apy-calculator');
  });

  it('finds AI SaaS functions in the same search surface', () => {
    expect(searchTools('repurpose content')[0]?.slug).toBe('ai-content-repurposer');
    expect(searchTools('brand voice')[0]?.slug).toBe('brand-voice');
  });

  it('supports type and category filters', () => {
    const financeResults = searchTools('tax', { category: 'finance' });
    expect(financeResults.map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(['income-tax', 'side-income-tax', 'crypto-tax']),
    );

    expect(searchTools('repurpose', { type: 'calculator' })).toEqual([]);
  });
});
