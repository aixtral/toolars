import type { Metadata } from 'next';
import { BLOG_ARTICLES } from '@/data/blog';
import { CALCULATOR_TOOLS } from '@/data/calculators';
import type { ToolDefinition } from '@/data/types';
import { getAlternateLanguageLinks } from '@/lib/i18n';

type DirectoryPage = 'home' | 'tools' | 'ai';
type PublicCategoryPage = 'health' | 'finance';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
}

export interface PublicSitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

export interface RobotsPolicy {
  rules: Array<{
    userAgent: string;
    allow: string;
    disallow: string[];
  }>;
  sitemap: string;
}

const DEFAULT_SITE_URL = 'https://toolars.com';
const MANIFEST_LAST_MODIFIED = '2026-06-01';

const publicStaticRoutes = [
  '/',
  '/tools',
  '/ai',
  '/categories/health',
  '/categories/finance',
  '/blog',
  '/pricing',
  '/compare',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
] as const;

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

export function buildBlogMetadata(): Metadata {
  return {
    title: 'Blog | toolars',
    description:
      'Read English-first guides for free calculators, SEO-ready tool pages, and AI content workflows.',
    alternates: {
      canonical: '/blog',
      languages: getAlternateLanguageLinks('/blog', ['en']),
    },
  };
}

export function buildArticleMetadata(article: SeoArticle): Metadata {
  return {
    title: `${article.title} | toolars`,
    description: article.description,
    alternates: {
      canonical: `/blog/${article.slug}`,
      languages: getAlternateLanguageLinks(`/blog/${article.slug}`, ['en']),
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
  };
}

export function buildBreadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqPageSchema(faqs: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildWebApplicationSchema(tool: ToolDefinition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: tool.route,
    applicationCategory: tool.type === 'calculator' ? 'CalculatorApplication' : 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript for interactive calculations.',
    isAccessibleForFree: tool.type === 'calculator',
    offers: {
      '@type': 'Offer',
      price: tool.type === 'calculator' ? '0' : '9',
      priceCurrency: 'USD',
    },
  };
}

export function buildItemListSchema(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildBlogPostingSchema(article: SeoArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'toolars',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${article.slug}`,
    },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function normalizeSiteUrl(siteUrl = DEFAULT_SITE_URL) {
  return siteUrl.replace(/\/+$/, '');
}

function absoluteUrl(path: string, siteUrl = DEFAULT_SITE_URL) {
  const base = normalizeSiteUrl(siteUrl);
  return path === '/' ? `${base}/` : `${base}${path}`;
}

export function buildPublicSitemapEntries(siteUrl = DEFAULT_SITE_URL): PublicSitemapEntry[] {
  const staticEntries = publicStaticRoutes.map((route) => ({
    url: absoluteUrl(route, siteUrl),
    lastModified: MANIFEST_LAST_MODIFIED,
    changeFrequency: route === '/' ? 'daily' as const : 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  const calculatorEntries = CALCULATOR_TOOLS.map((tool) => ({
    url: absoluteUrl(tool.route, siteUrl),
    lastModified: MANIFEST_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: tool.isPopular ? 0.85 : 0.7,
  }));

  const articleEntries = BLOG_ARTICLES.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`, siteUrl),
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...calculatorEntries, ...articleEntries];
}

export function buildRobotsPolicy(siteUrl = DEFAULT_SITE_URL): RobotsPolicy {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/app/', '/login', '/register'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml', siteUrl),
  };
}

export function buildLlmsText(siteUrl = DEFAULT_SITE_URL) {
  const base = normalizeSiteUrl(siteUrl);
  const featuredCalculators = CALCULATOR_TOOLS.filter((tool) => tool.isPopular)
    .slice(0, 8)
    .map((tool) => `- ${tool.title}: ${absoluteUrl(tool.route, base)}`)
    .join('\n');

  const blogRoutes = BLOG_ARTICLES.map(
    (article) => `- ${article.title}: ${absoluteUrl(`/blog/${article.slug}`, base)}`,
  ).join('\n');

  return [
    '# toolars',
    '',
    'Toolars is an English-first utility website with 73 free calculators and account-based AI content tools.',
    'Public calculators are free and usable without login. AI tools are subscription-gated, and Pro workflows can include cross-device save, PDF/CSV advanced exports, and batch tools.',
    'Anonymous calculator inputs stay local unless the user explicitly saves or syncs through an account-backed workflow.',
    '',
    '## Key public routes',
    `- Home: ${absoluteUrl('/', base)}`,
    `- All tools: ${absoluteUrl('/tools', base)}`,
    `- AI tools directory: ${absoluteUrl('/ai', base)}`,
    `- Pricing: ${absoluteUrl('/pricing', base)}`,
    `- Compare saved calculator results: ${absoluteUrl('/compare', base)}`,
    `- Privacy: ${absoluteUrl('/privacy', base)}`,
    `- Terms: ${absoluteUrl('/terms', base)}`,
    '',
    '## Featured calculators',
    featuredCalculators,
    '',
    '## Editorial guides',
    blogRoutes,
    '',
    '## Boundaries',
    '- Calculator pages are public and indexable.',
    '- Account app pages, API routes, login, and register are excluded from the sitemap.',
    '- The AI directory is public, but generation, history, analytics, settings, and brand voice require account context.',
  ].join('\n');
}
