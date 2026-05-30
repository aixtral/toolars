import { Container } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const popularTools = [
  'BMI Calculator',
  'Mortgage Calculator',
  'Compound Interest Calculator',
  'AI Content Repurposer',
];

const categories = [
  'AI Content',
  'Body',
  'Fitness & Nutrition',
  'Wellness',
  'Wealth',
  'Finance Calculators',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="flex flex-col gap-8 py-10">
        <Card className="shadow-sm">
          <CardHeader>
            <p className="text-sm font-medium text-brand-600">
            Free calculators. Subscription AI tools.
            </p>
            <h1 className="text-4xl font-bold leading-[44px]">
              Search 73 calculators and AI tools
            </h1>
          </CardHeader>
          <CardContent>
            <label className="sr-only" htmlFor="home-search">
                Search tools
              </label>
              <input
                id="home-search"
                type="search"
                aria-label="Search tools"
                placeholder="Search 73 calculators and AI tools..."
                className="min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-accent-ai">Featured AI Tool</p>
              <CardTitle>AI Content Repurposer</CardTitle>
            </CardHeader>
            <CardContent>
              Transform one source into social posts, email, articles, and more.
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Popular Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
              {popularTools.map((tool) => (
                <li key={tool} className="rounded-lg border border-neutral-200 px-3 py-2">
                  {tool}
                </li>
              ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-lg border border-neutral-200 bg-white p-4">
              {category}
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
