import { AI_TOOLS } from '@/data/ai-tools';
import { TOOL_CATEGORIES } from '@/data/categories';
import { ALL_TOOLS, getPopularTools, getToolsByCategory } from '@/data/tools';
import type { ToolCategory } from '@/data/types';

export const directoryTabs = [
  'All',
  'Popular',
  'AI Writing',
  'Data & Analytics',
  'Finance',
  'Marketing',
  'Productivity',
  'Design',
  'Development',
  'Education',
  'Health & Wellness',
] as const;

export const healthCategories: readonly ToolCategory[] = [
  'body',
  'fitness-nutrition',
  'wellness',
];

export const financeCategories: readonly ToolCategory[] = ['finance', 'wealth'];

export const platformSupport = [
  'Twitter Thread',
  'LinkedIn Post',
  'Newsletter',
  'Medium Article',
  'Reddit Post',
  'Instagram Post',
  'YouTube Script',
  'Facebook Post',
  'Hacker News Post',
  'Indie Hackers Post',
  'WeChat Article',
  'Xiaohongshu Post',
  'Jike Post',
  'Zhihu Answer',
] as const;

const publicCategoryRouteBySlug: Record<ToolCategory, string> = {
  'ai-content': '/ai',
  body: '/categories/health',
  'fitness-nutrition': '/categories/health',
  wellness: '/categories/health',
  wealth: '/categories/finance',
  finance: '/categories/finance',
};

export function toolsForCategories(categories: readonly ToolCategory[]) {
  return ALL_TOOLS.filter((tool) => categories.includes(tool.category));
}

export function categoryCount(category: ToolCategory) {
  return getToolsByCategory(category).length;
}

export function featuredTools() {
  return getPopularTools(8);
}

export function categoryCards() {
  return TOOL_CATEGORIES.map((category) => ({
    ...category,
    route: publicCategoryRouteBySlug[category.slug],
    count: categoryCount(category.slug),
  }));
}

export function allDirectoryTools(limit = 12) {
  return ALL_TOOLS.slice(0, limit);
}

export function aiDirectoryTools() {
  return AI_TOOLS;
}
