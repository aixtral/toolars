import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { BLOG_ARTICLES } from '@/data/blog';
import type { ToolDefinition } from '@/data/types';
import { getToolBySlug } from '@/data/tools';
import { buildBlogMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  // Preserve the translated title/description but inherit the canonical +
  // alternate-language links from the shared SEO builder.
  return {
    ...buildBlogMetadata(),
    title: t('listHeading'),
    description: t('listDescription'),
  };
}

function isTool(tool: ToolDefinition | undefined): tool is ToolDefinition {
  return Boolean(tool);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  const featuredTools = BLOG_ARTICLES.flatMap((article) => article.featuredToolSlugs)
    .map((slug) => getToolBySlug(slug))
    .filter(isTool)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0 space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{t('englishFirst')}</Badge>
              <Badge variant="success">{t('calculatorSeo')}</Badge>
              <Badge variant="ai">{t('aiWorkflows')}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">{t('listHeading')}</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {t('listDescription')}
            </p>
            <div className="mt-5 flex min-h-11 items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3">
              <Search aria-hidden="true" size={18} strokeWidth={2} className="text-neutral-500" />
              <Input
                aria-label={t('searchLabel')}
                className="border-0 bg-transparent px-0 shadow-none"
                placeholder={t('searchPlaceholder')}
                type="search"
              />
            </div>
          </div>

          <section aria-label={t('latestArticles')} className="grid gap-4">
            {BLOG_ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-500 hover:shadow-toolars"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-600">
                  <Badge variant={article.category === 'AI Workflow' ? 'ai' : 'default'}>
                    {article.category}
                  </Badge>
                  <span>{article.readTime}</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={article.updatedAt}>{t('updated')} {article.updatedAt}</time>
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-8 text-ink">
                  <Link href={`/blog/${article.slug}`} className="hover:text-brand-700">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base leading-6 text-neutral-600">{article.description}</p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand-700 hover:text-ink"
                >
                  {t('readGuide')}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
                </Link>
              </article>
            ))}
          </section>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t('editorialFocus')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-5 text-neutral-600">
              <p>
                {t('editorialFocusBody')}
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-semibold text-neutral-700">
                <BookOpen aria-hidden="true" size={16} strokeWidth={2} />
                {t('englishLaunchContent')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('referencedTools')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.route}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                >
                  {tool.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </Container>
    </main>
  );
}
