import type { ToolCategoryDefinition } from '@/data/types';

export const TOOL_CATEGORIES: readonly ToolCategoryDefinition[] = [
  {
    slug: 'ai-content',
    title: 'AI Content',
    description: 'Repurpose, plan, and manage content workflows with AI.',
    route: '/ai',
    icon: 'sparkles',
  },
  {
    slug: 'body',
    title: 'Body',
    description: 'Body composition, weight ranges, and health screening tools.',
    route: '/categories/health',
    icon: 'scale',
  },
  {
    slug: 'fitness-nutrition',
    title: 'Fitness & Nutrition',
    description: 'Training, calorie, macro, hydration, and nutrition calculators.',
    route: '/categories/health',
    icon: 'activity',
  },
  {
    slug: 'wellness',
    title: 'Wellness',
    description: 'Sleep, mental health, recovery, and everyday wellness tools.',
    route: '/categories/health',
    icon: 'heart',
  },
  {
    slug: 'wealth',
    title: 'Wealth',
    description: 'Investing, retirement, savings, and long-term planning tools.',
    route: '/categories/finance',
    icon: 'trending-up',
  },
  {
    slug: 'finance',
    title: 'Finance Calculators',
    description: 'Loans, taxes, debt, budgets, rates, and daily money decisions.',
    route: '/categories/finance',
    icon: 'wallet',
  },
];
