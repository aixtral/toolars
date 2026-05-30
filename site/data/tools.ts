import { AI_TOOLS } from '@/data/ai-tools';
import { CALCULATOR_TOOLS } from '@/data/calculators';
import type { ToolDefinition } from '@/data/types';

export const ALL_TOOLS: readonly ToolDefinition[] = [
  ...CALCULATOR_TOOLS,
  ...AI_TOOLS,
];

export function getToolBySlug(slug: string) {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolDefinition['category']) {
  return ALL_TOOLS.filter((tool) => tool.category === category);
}

export function getPopularTools(limit = 8) {
  return ALL_TOOLS.filter((tool) => tool.isPopular).slice(0, limit);
}
