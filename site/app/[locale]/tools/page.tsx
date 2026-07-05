import { SlidersHorizontal } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { SavedToolsCard } from '@/components/discovery';
import { CategoryCard, ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  allDirectoryTools,
  categoryCards,
  directoryTabs,
} from '@/lib/discovery';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools' });
  return {
    title: t('directoryHeading'),
    description: t('directoryDescription'),
    alternates: buildAlternates('/tools'),
  };
}

export default async function ToolsDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tools');
  const tCommon = await getTranslations('common');

  const tools = allDirectoryTools(12);
  const categories = categoryCards();
  const filterControls = [
    {
      id: 'directory-category',
      label: t('filterCategory'),
      options: [
        t('optionAllCategories'),
        t('optionAiContent'),
        t('optionHealthTools'),
        t('optionFinance'),
        t('optionWealth'),
      ],
    },
    {
      id: 'directory-tool-type',
      label: t('filterToolType'),
      options: [t('optionAllTools'), t('optionCalculator'), t('optionAiTool')],
    },
    {
      id: 'directory-pricing',
      label: t('filterPricing'),
      options: [
        t('optionAnyPricing'),
        t('optionFree'),
        t('optionFreemium'),
        t('optionSubscription'),
      ],
    },
    {
      id: 'directory-sort',
      label: t('filterSort'),
      options: [
        t('optionMostPopular'),
        t('optionNewest'),
        t('optionHighestRated'),
        t('optionAZ'),
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="order-2 space-y-4 lg:sticky lg:top-24 lg:order-1 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t('categoriesTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.route}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                >
                  {category.title}
                </Link>
              ))}
            </CardContent>
          </Card>

          <SavedToolsCard />
        </aside>

        <section className="order-1 min-w-0 space-y-6 lg:order-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>73 {tCommon('calculators')}</Badge>
              <Badge variant="ai">{tCommon('aiSaaSTools')}</Badge>
              <Badge variant="success">{tCommon('noLogin')}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">{t('directoryHeading')}</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {t('directoryDescription')}
            </p>
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
              <Input
                type="search"
                aria-label={t('searchLabel')}
                placeholder={t('searchPlaceholder')}
              />
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={2} />
                {t('filters')}
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {filterControls.map((control) => (
                <div key={control.id} className="grid gap-1.5">
                  <label
                    className="text-xs font-bold uppercase leading-4 text-neutral-500"
                    htmlFor={control.id}
                  >
                    {control.label}
                  </label>
                  <select
                    id={control.id}
                    aria-label={control.label}
                    className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    defaultValue={control.options[0]}
                  >
                    {control.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <nav aria-label="Directory filters" className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {directoryTabs.map((tab) => (
              <a
                key={tab}
                href="#tool-grid"
                className="min-h-11 shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                {tab}
              </a>
            ))}
          </nav>

          <section id="tool-grid" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>

          <section aria-label="Category cards" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} count={category.count} />
            ))}
          </section>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-700 shadow-sm">
            {t('directoryNote')}
          </div>
        </section>
      </Container>
    </main>
  );
}
