import type { Metadata } from 'next';

type DirectoryPage = 'home' | 'tools' | 'ai';
type PublicCategoryPage = 'health' | 'finance';

const directoryMetadata: Record<DirectoryPage, Metadata> = {
  home: {
    title: 'toolars | Free Calculators and AI Tools',
    description:
      'Search 73 free calculators and account-based AI tools from one fast utility dashboard.',
    alternates: {
      canonical: '/',
    },
  },
  tools: {
    title: 'All Tools Directory | toolars',
    description:
      'Browse 73 free calculators and AI tools by category, pricing, and use case.',
    alternates: {
      canonical: '/tools',
    },
  },
  ai: {
    title: 'AI Tools Directory | toolars',
    description:
      'Explore account-based AI content tools for repurposing, templates, brand voice, history, analytics, and settings.',
    alternates: {
      canonical: '/ai',
    },
  },
};

const categoryMetadata: Record<PublicCategoryPage, Metadata> = {
  health: {
    title: 'Health Calculators | toolars',
    description:
      'Browse free body, fitness, nutrition, and wellness calculators with no signup required.',
    alternates: {
      canonical: '/categories/health',
    },
  },
  finance: {
    title: 'Finance Calculators | toolars',
    description:
      'Browse free loan, debt, tax, investing, retirement, and money calculators with crawlable tool links.',
    alternates: {
      canonical: '/categories/finance',
    },
  },
};

export function buildDirectoryMetadata(page: DirectoryPage): Metadata {
  return directoryMetadata[page];
}

export function buildCategoryMetadata(page: PublicCategoryPage): Metadata {
  return categoryMetadata[page];
}
