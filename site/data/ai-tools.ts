import type { AiToolDefinition, SaasPageDefinition } from '@/data/types';

export const AI_TOOLS: readonly AiToolDefinition[] = [
  {
    slug: 'ai-content-repurposer',
    title: 'AI Content Repurposer',
    type: 'ai',
    category: 'ai-content',
    icon: 'sparkles',
    description:
      'Repurpose one URL or text source into platform-native social posts, newsletters, articles, and community updates.',
    route: '/app/repurpose',
    badges: ['AI', 'Subscription'],
    isPopular: true,
    requiresAccount: true,
    subscription: 'account',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'AI Content Repurposer | toolars',
      description:
        'Turn one source into multi-platform content with tone, platform, brand voice, and model controls.',
      keywords: ['ai', 'content', 'repurpose', 'twitter', 'linkedin', 'newsletter'],
    },
  },
  {
    slug: 'template-library',
    title: 'Template Library',
    type: 'ai',
    category: 'ai-content',
    icon: 'files',
    description:
      'Start from reusable content workflows for social posts, long-form articles, newsletters, and community launches.',
    route: '/app/templates',
    badges: ['AI', 'Templates'],
    requiresAccount: true,
    subscription: 'account',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'AI Template Library | toolars',
      description:
        'Browse reusable AI content templates for social, long-form, email, and community channels.',
      keywords: ['template', 'library', 'content', 'workflow'],
    },
  },
  {
    slug: 'brand-voice',
    title: 'Brand Voice',
    type: 'ai',
    category: 'ai-content',
    icon: 'mic',
    description:
      'Save reusable brand voice profiles so AI output stays consistent across channels and teams.',
    route: '/app/brand-voice',
    badges: ['AI', 'Pro'],
    requiresAccount: true,
    subscription: 'pro',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'Brand Voice Profiles | toolars',
      description:
        'Create and manage brand voice profiles for consistent AI-generated content.',
      keywords: ['brand', 'voice', 'style', 'profile'],
    },
  },
  {
    slug: 'content-history',
    title: 'Content History',
    type: 'ai',
    category: 'ai-content',
    icon: 'history',
    description:
      'Review, reopen, copy, and regenerate previous AI repurposing jobs across platforms.',
    route: '/app/history',
    badges: ['AI', 'Account'],
    requiresAccount: true,
    subscription: 'account',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'AI Content History | toolars',
      description: 'Access saved AI repurposing jobs and outputs from your workspace.',
      keywords: ['history', 'saved', 'repurpose', 'outputs'],
    },
  },
  {
    slug: 'performance-analytics',
    title: 'Performance Analytics',
    type: 'ai',
    category: 'ai-content',
    icon: 'bar-chart-3',
    description:
      'Track repurposing volume, platform mix, tone usage, and recent content performance signals.',
    route: '/app/analytics',
    badges: ['AI', 'Pro'],
    requiresAccount: true,
    subscription: 'pro',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'AI Content Analytics | toolars',
      description:
        'Measure content repurposing activity, platform output, and workspace trends.',
      keywords: ['analytics', 'performance', 'content', 'platforms'],
    },
  },
  {
    slug: 'workspace-settings',
    title: 'Workspace Settings',
    type: 'ai',
    category: 'ai-content',
    icon: 'settings',
    description:
      'Manage account, workspace preferences, model defaults, billing context, and AI settings.',
    route: '/app/settings',
    badges: ['AI', 'Account'],
    requiresAccount: true,
    subscription: 'account',
    sourceProject: 'aixtral-labs/xtralrepurpose',
    seo: {
      title: 'Workspace Settings | toolars',
      description: 'Manage account, model, subscription, and AI workspace settings.',
      keywords: ['settings', 'workspace', 'account', 'billing'],
    },
  },
];

export const AI_SAAS_PAGES: readonly SaasPageDefinition[] = [
  {
    slug: 'repurpose',
    title: 'Repurpose',
    route: '/app/repurpose',
    requiresAccount: true,
  },
  {
    slug: 'templates',
    title: 'Template Library',
    route: '/app/templates',
    requiresAccount: true,
  },
  {
    slug: 'brand-voice',
    title: 'Brand Voice',
    route: '/app/brand-voice',
    requiresAccount: true,
  },
  {
    slug: 'history',
    title: 'History',
    route: '/app/history',
    requiresAccount: true,
  },
  {
    slug: 'analytics',
    title: 'Analytics',
    route: '/app/analytics',
    requiresAccount: true,
  },
  {
    slug: 'settings',
    title: 'Settings',
    route: '/app/settings',
    requiresAccount: true,
  },
  {
    slug: 'login',
    title: 'Login',
    route: '/login',
    requiresAccount: false,
  },
  {
    slug: 'register',
    title: 'Register',
    route: '/register',
    requiresAccount: false,
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    route: '/pricing',
    requiresAccount: false,
  },
];
