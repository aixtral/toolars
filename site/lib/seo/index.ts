import type { Metadata } from 'next';
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
