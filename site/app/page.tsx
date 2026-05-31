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

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="flex flex-col gap-8 py-8">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Free calculators</Badge>
              <Badge>Local where possible</Badge>
              <Badge variant="ai">AI account required</Badge>
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <p className="text-sm font-medium text-accent-ai">Featured AI Tool</p>
                <CardTitle>AI Content Repurposer</CardTitle>
              </CardHeader>
              <CardContent>
                Transform one source into posts, email, articles, and launch updates.
                <a className="mt-4 block font-semibold text-brand-700 hover:underline" href="/ai">
                  View AI tools
                </a>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {['Calculate BMI', 'Estimate mortgage', 'Compare interest', 'Repurpose content'].map((action) => (
                  <a
                    key={action}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                    href="/tools"
                  >
                    {action}
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
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
