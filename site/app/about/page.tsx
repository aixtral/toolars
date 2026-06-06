import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About toolars',
  description:
    'About toolars, a search-first calculators and AI content repurposing workspace.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Independent tools</Badge>
            <Badge variant="ai">AI content repurposing</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">About toolars</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Toolars is a search-first calculators and AI content repurposing
            workspace for people who want fast utility without noisy marketing.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Precise', 'Calculator pages emphasize formulas, examples, and clear result states.'],
            ['Fast', 'Search, categories, recent tools, and direct actions shorten the path to work.'],
            ['Commercial', 'AI workflows add account-backed history, brand voice, analytics, and Pro exports.'],
          ].map(([title, copy]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>{copy}</CardContent>
            </Card>
          ))}
        </section>
      </Container>
    </main>
  );
}
