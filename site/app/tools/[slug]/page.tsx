import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';
import { CalculatorPageActions, CalculatorWorkspace } from '@/components/calculators';
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

const calculatorFaq = [
  {
    question: 'Do I need an account?',
    answer: 'No. Basic calculator use is free and does not require login.',
  },
  {
    question: 'Where are saved results stored?',
    answer: 'Saved and comparison results use local browser storage in this release.',
  },
] as const;

export function generateStaticParams() {
  return APPROVED_CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = findCalculator(slug);

  if (!tool) {
    return {
      title: 'Tool not found | toolars',
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
  const { slug } = await params;
  const tool = findCalculator(slug);

  if (!tool) notFound();

  const engine = getCalculatorEngine(tool.slug);
  const relatedTools = relatedToolsFor(tool);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Tools', url: '/tools' },
    { name: tool.title, url: tool.route },
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
            Tools
          </Link>
          <span aria-hidden="true" className="px-2 text-neutral-400">
            /
          </span>
          <span className="text-ink">{tool.title}</span>
        </nav>

        <section className="grid gap-5 border-b border-neutral-200 pb-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {tool.badges?.map((badge) => (
                <Badge key={badge} variant={badge === 'Free' ? 'success' : 'default'}>
                  {badge}
                </Badge>
              ))}
              <Badge>{tool.category.replace('-', ' ')}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-9 text-ink sm:text-4xl sm:leading-[44px]">
              {tool.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {tool.description}
            </p>
            <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 bg-white px-3 py-3">
                <p className="text-xs font-bold uppercase text-neutral-500">Access</p>
                <p className="mt-1 text-sm font-semibold text-ink">Free, no login</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white px-3 py-3">
                <p className="text-xs font-bold uppercase text-neutral-500">Runtime</p>
                <p className="mt-1 text-sm font-semibold text-ink">Browser-local</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white px-3 py-3">
                <p className="text-xs font-bold uppercase text-neutral-500">Output</p>
                <p className="mt-1 text-sm font-semibold text-ink">Save, compare, share</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <CalculatorPageActions route={tool.route} title={tool.title} />
            <section
              aria-label="Calculator formula preview"
              className="hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:block"
            >
              <p className="text-xs font-bold uppercase text-neutral-500">Formula</p>
              <p className="mt-2 text-sm font-semibold leading-5 text-ink">
                {engine.formulaLabel}
              </p>
            </section>
          </div>
        </section>

        <CalculatorWorkspace relatedTools={relatedTools} slug={tool.slug} tool={tool} />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold leading-8 text-ink">How the calculation works</h2>
            <p className="mt-3 text-base leading-6 text-neutral-600">
              This page uses the migrated pure formula engine for {tool.title}. Inputs are
              validated before a result is shown, and the formula stays independent from
              account, billing, and network state so search engines can crawl the public
              page cleanly.
            </p>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-semibold text-neutral-700">
              {engine.formulaLabel}
            </div>
          </article>

          <section
            aria-label="Calculator FAQ"
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold leading-7 text-ink">FAQ</h2>
            <div className="mt-4 space-y-4">
              {calculatorFaq.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-sm font-bold text-ink">{faq.question}</h3>
                  <p className="mt-1 text-sm leading-5 text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </Container>
    </main>
  );
}
