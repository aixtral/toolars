import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { CalculatorWorkspace } from '@/components/calculators';
import { Badge } from '@/components/ui';
import { APPROVED_CALCULATOR_SLUGS } from '@/data/calculators';
import type { CalculatorDefinition, ToolDefinition } from '@/data/types';
import { ALL_TOOLS, getPopularTools, getToolBySlug } from '@/data/tools';
import type { CalculatorSlug } from '@/lib/calculators';
import { getCalculatorEngine } from '@/lib/calculators';
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebApplicationSchema,
  serializeJsonLd,
} from '@/lib/seo';

type CalculatorTool = CalculatorDefinition & { slug: CalculatorSlug };

interface ToolPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

function isCalculatorSlug(slug: string): slug is CalculatorSlug {
  return APPROVED_CALCULATOR_SLUGS.includes(slug as CalculatorSlug);
}

function findCalculator(slug: string) {
  const tool = getToolBySlug(slug);
  if (!tool || tool.type !== 'calculator' || !isCalculatorSlug(slug)) return undefined;
  return tool as CalculatorTool;
}

function isCalculatorTool(tool: ToolDefinition | undefined): tool is CalculatorDefinition {
  return Boolean(tool && tool.type === 'calculator');
}

function relatedToolsFor(tool: CalculatorDefinition) {
  const explicit = (tool.relatedSlugs ?? [])
    .map((slug) => ALL_TOOLS.find((item) => item.slug === slug))
    .filter(isCalculatorTool);

  if (explicit.length > 0) return explicit.slice(0, 4);

  return getPopularTools(12)
    .filter((item) => item.type === 'calculator' && item.slug !== tool.slug)
    .slice(0, 4);
}

export function generateStaticParams() {
  return APPROVED_CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = findCalculator(slug);

  if (!tool) {
    const t = await getTranslations({ locale, namespace: 'calculator' });
    return {
      title: t('notFoundTitle'),
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: tool.route,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = findCalculator(slug);

  if (!tool) notFound();

  const t = await getTranslations('calculator');
  const tCalc = await getTranslations('calculators.' + tool.slug);
  const engine = getCalculatorEngine(tool.slug);
  // Localized overrides with graceful fallback to the source string.
  const formulaLabel = tCalc.has('formulaLabel') ? tCalc('formulaLabel') : engine.formulaLabel;
  const toolTitle = tCalc.has('title') ? tCalc('title') : tool.title;
  const toolDescription = tCalc.has('description') ? tCalc('description') : tool.description;
  const relatedTools = relatedToolsFor(tool);
  const calculatorFaq = [
    {
      question: t('faqAccountQuestion'),
      answer: t('faqAccountAnswer'),
    },
    {
      question: t('faqStorageQuestion'),
      answer: t('faqStorageAnswer'),
    },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbTools'), url: '/tools' },
    { name: toolTitle, url: tool.route },
  ]);
  const webApplicationSchema = buildWebApplicationSchema(tool);
  const faqSchema = buildFaqPageSchema(calculatorFaq);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Container className="space-y-7 py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-semibold text-neutral-600">
          <Link className="hover:text-brand-700" href="/tools">
            {t('breadcrumbTools')}
          </Link>
          <span aria-hidden="true" className="px-2 text-neutral-400">
            /
          </span>
          <span className="text-ink">{toolTitle}</span>
        </nav>

        <section className="grid gap-5 border-b border-neutral-200 pb-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {tool.badges?.map((badge) => (
                <Badge key={badge} variant={badge === 'Free' ? 'success' : 'default'}>
                  {badge}
                </Badge>
              ))}
              <Badge>{tool.category.replace('-', ' ')}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">
              {toolTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {toolDescription}
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
              {t('formulaLabel')}
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-ink">
              {formulaLabel}
            </p>
          </div>
        </section>

        <CalculatorWorkspace relatedTools={relatedTools} slug={tool.slug} tool={tool} />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold leading-8 text-ink">{t('howItWorks')}</h2>
            <p className="mt-3 text-base leading-6 text-neutral-600">
              {t('howItWorksBody', { title: toolTitle })}
            </p>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-semibold text-neutral-700">
              {formulaLabel}
            </div>
          </article>

          <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold leading-7 text-ink">{t('faqTitle')}</h2>
            <div className="mt-4 space-y-4">
              {calculatorFaq.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-sm font-bold text-ink">{faq.question}</h3>
                  <p className="mt-1 text-sm leading-5 text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </Container>
    </main>
  );
}
