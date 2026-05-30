import { describe, expect, it } from 'vitest';
import { AI_SAAS_PAGES, AI_TOOLS } from '@/data/ai-tools';
import { CALCULATOR_TOOLS } from '@/data/calculators';
import { TOOL_CATEGORIES } from '@/data/categories';
import { ALL_TOOLS } from '@/data/tools';

describe('tool registry', () => {
  it('includes the approved 73 calculator inventory with public routes', () => {
    expect(CALCULATOR_TOOLS).toHaveLength(73);

    const slugs = new Set(CALCULATOR_TOOLS.map((tool) => tool.slug));
    expect(slugs.size).toBe(73);
    expect(Array.from(slugs)).toEqual(
      expect.arrayContaining([
        'bmi-calculator',
        'mortgage-calculator',
        'compound-interest',
        'glp1-eligibility',
        'credit-score-simulator',
      ]),
    );

    for (const calculator of CALCULATOR_TOOLS) {
      expect(calculator.type).toBe('calculator');
      expect(calculator.requiresAccount).toBe(false);
      expect(calculator.route).toBe(`/tools/${calculator.slug}`);
      expect(calculator.seo.title).toContain(calculator.title);
      expect(calculator.seo.description.length).toBeGreaterThan(40);
    }
  });

  it('keeps calculator categories aligned to the toolars IA', () => {
    expect(TOOL_CATEGORIES.map((category) => category.slug)).toEqual([
      'ai-content',
      'body',
      'fitness-nutrition',
      'wellness',
      'wealth',
      'finance',
    ]);

    const categorySlugs = new Set(TOOL_CATEGORIES.map((category) => category.slug));
    expect(CALCULATOR_TOOLS.every((tool) => categorySlugs.has(tool.category))).toBe(
      true,
    );
  });

  it('tracks all current AI SaaS pages and merges AI tools into the registry', () => {
    expect(AI_SAAS_PAGES.map((page) => page.route)).toEqual([
      '/app/repurpose',
      '/app/templates',
      '/app/brand-voice',
      '/app/history',
      '/app/analytics',
      '/app/settings',
      '/login',
      '/register',
      '/pricing',
    ]);
    expect(AI_TOOLS.every((tool) => tool.requiresAccount)).toBe(true);
    expect(ALL_TOOLS).toHaveLength(CALCULATOR_TOOLS.length + AI_TOOLS.length);
    expect(new Set(ALL_TOOLS.map((tool) => tool.slug)).size).toBe(ALL_TOOLS.length);
  });
});
