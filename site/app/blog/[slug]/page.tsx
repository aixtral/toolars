import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { Container } from '@/components/layout';
import { ToolCard } from '@/components/tools';
import { Badge } from '@/components/ui';
import { BLOG_ARTICLES, getBlogArticle } from '@/data/blog';
import type { ToolDefinition } from '@/data/types';
import { getToolBySlug } from '@/data/tools';
import {
  buildArticleMetadata,
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  serializeJsonLd,
} from '@/lib/seo';

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function isTool(tool: ToolDefinition | undefined): tool is ToolDefinition {
  return Boolean(tool);
}

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    return {
      title: 'Article not found | toolars',
    };
  }

  return buildArticleMetadata(article);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) notFound();

  const relatedTools = article.featuredToolSlugs
    .map((toolSlug) => getToolBySlug(toolSlug))
    .filter(isTool);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Blog', url: '/blog' },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);
  const articleSchema = buildBlogPostingSchema(article);
  const faqSchema = buildFaqPageSchema(article.faq);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Container className="grid gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-neutral-600">
            <Link className="hover:text-brand-700" href="/blog">
              Blog
            </Link>
            <span aria-hidden="true" className="px-2 text-neutral-400">
              /
            </span>
            <span className="text-ink">{article.title}</span>
          </nav>

          <header className="mt-5 border-b border-neutral-200 pb-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={article.category === 'AI Workflow' ? 'ai' : 'default'}>
                {article.category}
              </Badge>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600">
                <Clock aria-hidden="true" size={15} strokeWidth={2} />
                {article.readTime}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[44px] text-ink">
              {article.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {article.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-neutral-500">
              By {article.author} / Updated{' '}
              <time dateTime={article.updatedAt}>{article.updatedAt}</time>
            </p>
          </header>

          <div className="mt-7 space-y-7">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold leading-8 text-ink">{section.heading}</h2>
                <p className="mt-3 text-base leading-7 text-neutral-600">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold leading-8 text-ink">FAQ</h2>
            <div className="mt-4 grid gap-4">
              {article.faq.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-sm font-bold text-ink">{faq.question}</h3>
                  <p className="mt-1 text-sm leading-5 text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 shadow-sm hover:border-brand-500 hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
            Back to Blog
          </Link>

          <section aria-label="Related tools" className="grid gap-3">
            <h2 className="text-xl font-bold leading-7 text-ink">Related Tools</h2>
            {relatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>
        </aside>
      </Container>
    </main>
  );
}
