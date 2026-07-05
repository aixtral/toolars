import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { SavedToolsCard } from '@/components/discovery';
import { CategoryCard, ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { categoryCards, featuredTools } from '@/lib/discovery';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  const popularTools = featuredTools().slice(0, 4);
  const categories = categoryCards();
  const quickActions = [
    { label: t('quickActionBmi'), href: '/tools/bmi-calculator' },
    { label: t('quickActionMortgage'), href: '/tools/mortgage-calculator' },
    { label: t('quickActionInterest'), href: '/tools/compound-interest' },
    { label: t('quickActionRepurpose'), href: '/app/repurpose' },
  ];

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="flex flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4 text-sm font-semibold text-neutral-700">
          <Badge variant="success">{tCommon('freeCalculators')}</Badge>
          <Badge>{tCommon('localBrowserCalculations')}</Badge>
          <Badge>{tCommon('noSignupForCalculators')}</Badge>
          <Badge>{tCommon('multilingualReady')}</Badge>
          <Badge variant="ai">{tCommon('aiToolsRequireAccount')}</Badge>
        </div>

        <section
          aria-label={t('discoveryLabel')}
          className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.9fr)_minmax(280px,0.95fr)]"
        >
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">73 {tCommon('calculators')}</Badge>
              <Badge variant="ai">{tCommon('aiSaaSTools')}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">
              {t('heroHeading')}
            </h1>
            <p className="mt-3 text-base leading-6 text-neutral-600">
              {t('heroDescription')}
            </p>
            <div className="mt-5">
              <label className="sr-only" htmlFor="home-search">
                {tNav('searchTools')}
              </label>
              <Input
                id="home-search"
                type="search"
                aria-label={tNav('searchTools')}
                placeholder={tNav('searchPlaceholder')}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('popularTools')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {popularTools.map((tool) => (
                <a key={tool.slug} href={tool.route} className="rounded-lg border border-neutral-200 px-3 py-2 font-semibold text-ink hover:border-brand-500">
                  {tool.title}
                </a>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <p className="text-sm font-medium text-accent-ai">{t('featuredAiEyebrow')}</p>
                <CardTitle>{t('featuredAiTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                {t('featuredAiBody')}
                <Link className="mt-4 block font-semibold text-brand-700 hover:underline" href="/ai">
                  {t('featuredAiLink')}
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                    href={action.href}
                  >
                    {action.label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4">
          <SavedToolsCard />
        </section>

        <section
          aria-label={t('comparisonLabel')}
          className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <h2 className="text-xl font-semibold leading-7 text-ink">{t('comparisonHeading')}</h2>
            <p className="mt-1 text-sm leading-5 text-neutral-600">
              {t('comparisonBody')}
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            href="/tools"
          >
            {t('comparisonCta')}
          </Link>
        </section>

        <section aria-label={t('categoriesLabel')} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} count={category.count} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('previewAiDashboard')}</CardTitle>
            </CardHeader>
            <CardContent>
              {t('previewAiDashboardBody')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('previewTemplates')}</CardTitle>
            </CardHeader>
            <CardContent>
              {t('previewTemplatesBody')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('previewAnalytics')}</CardTitle>
            </CardHeader>
            <CardContent>
              {t('previewAnalyticsBody')}
            </CardContent>
          </Card>
        </section>

        <section aria-label={t('featuredLabel')} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </section>
      </Container>
    </main>
  );
}
