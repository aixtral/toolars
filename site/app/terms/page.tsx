import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms | toolars',
  description:
    'Toolars terms for free calculators, account-gated AI tools, Pro exports, and acceptable use.',
};

const termsSections = [
  [
    'Free calculators',
    'Free calculators are provided for general informational use. You are responsible for reviewing inputs, formulas, assumptions, and results before making decisions.',
  ],
  [
    'AI tools and plans',
    'AI tools require an account and may require a paid plan. Outputs are drafts for review, editing, and approval before publication or business use.',
  ],
  [
    'Exports and saved work',
    'PDF/CSV advanced exports, cross-device save, and batch workflows can depend on account context and Pro plan availability.',
  ],
  [
    'Acceptable use',
    'Do not use Toolars to violate laws, abuse services, reverse engineer protected systems, or generate harmful, deceptive, or infringing content.',
  ],
  [
    'Availability',
    'Toolars may change, pause, or improve tools, AI models, limits, pricing, and export behavior as the product evolves.',
  ],
  [
    'Contact',
    'Questions about these terms, product boundaries, or account workflows can be sent to hello@toolars.com.',
  ],
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge>Product terms</Badge>
            <Badge variant="success">Free calculators</Badge>
            <Badge variant="ai">Account AI workflows</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">Terms</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            These product terms describe the current Toolars boundaries for free
            calculators, account-gated AI tools, Pro exports, saved work, and
            acceptable use. They are written for product clarity and should be
            reviewed before launch with final legal counsel.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {termsSections.map(([title, copy]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>{copy}</CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Related trust routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link className="font-semibold text-brand-700 hover:underline" href="/privacy">
                Privacy
              </Link>
              <Link className="font-semibold text-brand-700 hover:underline" href="/contact">
                Contact
              </Link>
              <Link className="font-semibold text-brand-700 hover:underline" href="/pricing">
                Pricing
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
