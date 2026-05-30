import { ALL_TOOLS } from '@/data/tools';
import type { ToolCategory, ToolDefinition, ToolType } from '@/data/types';

export interface SearchOptions {
  type?: ToolType;
  category?: ToolCategory;
  limit?: number;
}

interface ScoredTool {
  tool: ToolDefinition;
  score: number;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokensFor(value: string) {
  return normalize(value).split(' ').filter(Boolean);
}

function textParts(tool: ToolDefinition) {
  return {
    title: normalize(tool.title),
    slug: normalize(tool.slug),
    category: normalize(tool.category),
    description: normalize(tool.description),
    keywords: normalize(tool.seo.keywords?.join(' ') ?? ''),
    badges: normalize(tool.badges?.join(' ') ?? ''),
  };
}

function scoreTool(tool: ToolDefinition, query: string) {
  const parts = textParts(tool);
  const queryTokens = tokensFor(query);
  const normalizedQuery = normalize(query);
  let score = 0;

  if (parts.title === normalizedQuery) score += 120;
  if (parts.title.startsWith(normalizedQuery)) score += 90;
  if (parts.title.includes(normalizedQuery)) score += 70;
  if (parts.slug.includes(normalizedQuery)) score += 45;
  if (parts.keywords.includes(normalizedQuery)) score += 70;
  if (parts.description.includes(normalizedQuery)) score += 25;

  for (const token of queryTokens) {
    if (parts.title.includes(token)) score += 16;
    if (parts.slug.includes(token)) score += 12;
    if (parts.keywords.includes(token)) score += 10;
    if (parts.category.includes(token)) score += 6;
    if (parts.badges.includes(token)) score += 5;
    if (parts.description.includes(token)) score += 4;
  }

  if (tool.isPopular && score > 0) score += 3;
  return score;
}

export function searchTools(query: string, options: SearchOptions = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return ALL_TOOLS.filter((tool) => {
    if (options.type && tool.type !== options.type) return false;
    if (options.category && tool.category !== options.category) return false;
    return true;
  })
    .map<ScoredTool>((tool) => ({ tool, score: scoreTool(tool, normalizedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))
    .slice(0, options.limit ?? 12)
    .map((result) => result.tool);
}
