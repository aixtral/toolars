import Link from 'next/link';
import { Container } from '@/components/layout';
import { ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { financeCategories, toolsForCategories } from '@/lib/discovery';
import { buildCategoryMetadata } from '@/lib/seo';

export const metadata = buildCategoryMetadata('finance');

export default function FinanceCategoryPage() {
  const tools = toolsForCategories(financeCategories);
  const popular = tools.filter((tool) => tool.isPopular).slice(0, 5);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[1fr_300px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <nav className="text-sm font-semibold text-neutral-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-700">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/tools" className="hover:text-brand-700">Tools</Link>
              <span className="mx-2">/</span>
              <span>Finance</span>
            </nav>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">Finance Calculators</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Loan, debt, tax, investing, retirement, and everyday money calculators
              with crawlable public links and no signup for basic use.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="finance">Loans</Badge>
              <Badge variant="finance">Debt</Badge>
              <Badge variant="finance">Investing</Badge>
              <Badge variant="finance">Retirement</Badge>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.slice(0, 18).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600 shadow-sm">
            Results will stay transparent: formula explanation, examples, related tools, and export options belong to the calculator detail phase.
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Popular searches</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['mortgage', 'debt payoff', 'compound interest', 'income tax', 'retirement'].map((search) => (
                <Link key={search} href="/tools" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500">
                  {search}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related articles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {['How amortization changes total interest', 'Debt payoff methods compared', 'Why compounding frequency matters'].map((title) => (
                <Link key={title} href="/blog" className="text-sm font-semibold text-neutral-700 hover:text-brand-700">
                  {title}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently used</CardTitle>
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
