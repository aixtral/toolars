import { SlidersHorizontal } from 'lucide-react';
import { Container } from '@/components/layout';
import { CategoryCard, ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  allDirectoryTools,
  categoryCards,
  directoryTabs,
  favoriteTools,
  recentTools,
} from '@/lib/discovery';
import { buildDirectoryMetadata } from '@/lib/seo';
import { searchTools } from '@/lib/search';

export const metadata = buildDirectoryMetadata('tools');

interface ToolsDirectoryPageProps {
  searchParams?: Promise<{
    search?: string;
  }>;
}

const filterControls = [
  {
    id: 'directory-category',
    label: 'Category',
    options: ['All categories', 'AI Content', 'Health tools', 'Finance', 'Wealth'],
  },
  {
    id: 'directory-tool-type',
    label: 'Tool type',
    options: ['All tools', 'Calculator', 'AI Tool'],
  },
  {
    id: 'directory-pricing',
    label: 'Pricing',
    options: ['Any pricing', 'Free', 'Freemium', 'Subscription'],
  },
  {
    id: 'directory-sort',
    label: 'Sort',
    options: ['Most popular', 'Newest', 'Highest rated', 'A-Z'],
  },
];

function normalizeSearchQuery(value?: string) {
  return (value ?? '').trim().slice(0, 80);
}

export default async function ToolsDirectoryPage({ searchParams }: ToolsDirectoryPageProps = {}) {
  const params = await searchParams;
  const searchQuery = normalizeSearchQuery(params?.search);
  const isSearchResult = searchQuery.length > 0;
  const tools = isSearchResult
    ? searchTools(searchQuery, { limit: 12 })
    : allDirectoryTools(12);
  const categories = categoryCards();
  const recent = recentTools();
  const favorites = favoriteTools();

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="order-2 space-y-4 lg:sticky lg:top-24 lg:order-1 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={category.route}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                >
                  {category.title}
                </a>
              ))}
            </CardContent>
          </Card>

          <Card aria-label="Quick access">
            <CardHeader>
              <CardTitle>Quick access</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm font-semibold text-neutral-600">
                Favorites and recently used
              </p>
              {[...favorites, ...recent].slice(0, 5).map((tool) => (
                <a key={tool.slug} href={tool.route} className="text-sm font-semibold text-neutral-700 hover:text-brand-700">
                  {tool.title}
                </a>
              ))}
            </CardContent>
          </Card>
        </aside>

        <section className="order-1 min-w-0 space-y-6 lg:order-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>73 calculators</Badge>
              <Badge variant="ai">AI SaaS tools</Badge>
              <Badge variant="success">No login</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">All Tools Directory</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Browse calculators and AI tools by category, pricing model, and workflow.
              Every public tool link is crawlable and English-first.
            </p>
            <form action="/tools" className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
              <Input
                name="search"
                type="search"
                aria-label="Search all tools"
                defaultValue={searchQuery}
                placeholder="Search all calculators and AI tools..."
              />
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={2} />
                Filters
              </button>
            </form>
            {isSearchResult ? (
              <p className="mt-3 text-sm font-semibold text-neutral-600" aria-live="polite">
                Showing results for &quot;{searchQuery}&quot; ({tools.length}{' '}
                {tools.length === 1 ? 'match' : 'matches'}).
              </p>
            ) : null}
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

          <section
            id="tool-grid"
            aria-label={isSearchResult ? 'Search results' : 'Tool grid'}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {tools.length > 0 ? (
              tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)
            ) : (
              <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-5 text-sm font-semibold text-neutral-700">
                No tools found for &quot;{searchQuery}&quot;. Try a broader query or
                browse all tools.
              </div>
            )}
          </section>

          <section aria-label="Category cards" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} count={category.count} />
            ))}
          </section>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-700 shadow-sm">
            Showing 12 tools first. Load more, pagination, and saved local filters are reserved for the calculator template phase.
          </div>
        </section>
      </Container>
    </main>
  );
}
