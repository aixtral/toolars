import Link from 'next/link';
import { Container } from '@/components/layout';
import { CategoryCard, ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  categoryCards,
  favoriteTools,
  featuredTools,
  recentTools,
} from '@/lib/discovery';
import { buildDirectoryMetadata } from '@/lib/seo';

export const metadata = buildDirectoryMetadata('home');

export default function HomePage() {
  const popularTools = featuredTools().slice(0, 4);
  const recent = recentTools();
  const favorites = favoriteTools();
  const categories = categoryCards();
  const quickActions = [
    { label: 'Calculate BMI', href: '/tools/bmi-calculator' },
    { label: 'Estimate mortgage', href: '/tools/mortgage-calculator' },
    { label: 'Compare interest', href: '/tools/compound-interest' },
    { label: 'Repurpose content', href: '/app/repurpose' },
  ];

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="flex flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4 text-sm font-semibold text-neutral-700">
          <Badge variant="success">Free calculators</Badge>
          <Badge>Local browser calculations</Badge>
          <Badge>No signup for calculators</Badge>
          <Badge>Multilingual ready</Badge>
          <Badge variant="ai">AI tools require account</Badge>
        </div>

        <section
          aria-label="Tool discovery dashboard"
          className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.9fr)_minmax(280px,0.95fr)]"
        >
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">73 calculators</Badge>
              <Badge variant="ai">AI SaaS tools</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">
              Search 73 calculators and AI tools
            </h1>
            <p className="mt-3 text-base leading-6 text-neutral-600">
              A search-first utility dashboard for health, finance, wellness, and
              content workflows. Public calculators stay usable without signup.
            </p>
            <div className="mt-5">
              <label className="sr-only" htmlFor="home-search">
                Search tools
              </label>
              <Input
                id="home-search"
                type="search"
                aria-label="Search tools"
                placeholder="Search 73 calculators and AI tools..."
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Tools</CardTitle>
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
                <p className="text-sm font-medium text-accent-ai">Featured AI Tool</p>
                <CardTitle>AI Content Repurposer</CardTitle>
              </CardHeader>
              <CardContent>
                Transform one source into posts, email, articles, and launch updates.
                <Link className="mt-4 block font-semibold text-brand-700 hover:underline" href="/ai">
                  View AI tools
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
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

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Continue where you left off</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm font-semibold text-neutral-600">Recent Tools</p>
              {recent.map((tool) => (
                <a key={tool.slug} href={tool.route} className="text-sm font-semibold text-neutral-700 hover:text-brand-700">
                  {tool.title}
                </a>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorites</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {favorites.map((tool) => (
                <a key={tool.slug} href={tool.route} className="text-sm font-semibold text-neutral-700 hover:text-brand-700">
                  {tool.title}
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        <section
          aria-label="Comparison mode"
          className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <h2 className="text-xl font-semibold leading-7 text-ink">Comparison mode</h2>
            <p className="mt-1 text-sm leading-5 text-neutral-600">
              Compare saved calculator results locally, keep anonymous calculator work
              private, and upgrade later only for cross-device sync or premium exports.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            href="/tools"
          >
            Browse calculators
          </Link>
        </section>

        <section aria-label="Tool categories" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} count={category.count} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>AI Dashboard Preview</CardTitle>
            </CardHeader>
            <CardContent>
              Plan usage, model preferences, and platform outputs stay grouped in one account workspace.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Calculator Templates</CardTitle>
            </CardHeader>
            <CardContent>
              Shared calculator layouts keep formulas, examples, FAQ, and related tools consistent.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analytics Preview</CardTitle>
            </CardHeader>
            <CardContent>
              Pro AI workspaces can track content volume, platform mix, and saved outputs.
            </CardContent>
          </Card>
        </section>

        <section aria-label="Featured tools" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </section>
      </Container>
    </main>
  );
}
