import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { healthCategories, toolsForCategories } from '@/lib/discovery';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'category' });
  return {
    title: t('healthHeading'),
    description: t('healthDescription'),
    alternates: buildAlternates('/categories/health'),
  };
}

export default async function HealthCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('category');

  const tools = toolsForCategories(healthCategories);
  const popular = tools.filter((tool) => tool.isPopular).slice(0, 5);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[1fr_300px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <nav className="text-sm font-semibold text-neutral-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-700">{t('breadcrumbHome')}</Link>
              <span className="mx-2">/</span>
              <Link href="/tools" className="hover:text-brand-700">{t('breadcrumbTools')}</Link>
              <span className="mx-2">/</span>
              <span>{t('breadcrumbHealth')}</span>
            </nav>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">{t('healthHeading')}</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {t('healthDescription')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="health">{t('healthBodyBadge')}</Badge>
              <Badge variant="health">{t('healthFitnessBadge')}</Badge>
              <Badge variant="health">{t('healthWellnessBadge')}</Badge>
              <Badge>English-first</Badge>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.slice(0, 18).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600 shadow-sm">
            {t('healthFooter')}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t('popularSearches')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['BMI', 'TDEE', 'protein', 'sleep', 'blood pressure'].map((search) => (
                <Link key={search} href="/tools" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500">
                  {search}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              Health calculators are estimates, not medical advice. Pages will include formulas, examples, FAQ, and related tools as calculator modules are ported.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('frequentlyUsed')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {popular.map((tool) => (
                <Link key={tool.slug} href={tool.route} className="text-sm font-semibold text-neutral-700 hover:text-brand-700">
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
