import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pricing | toolars',
  description:
    'Toolars pricing for free calculators, AI tools subscription, Pro exports, cross-device save, and batch workflows.',
};

const plans = [
  {
    name: 'Free calculators',
    price: '$0',
    note: 'No signup for public calculators.',
    features: [
      '73 calculators stay free',
      'Local save and compare',
      'Search, categories, formulas, and FAQ',
    ],
    cta: 'Start with free tools',
    href: '/tools',
    featured: false,
  },
  {
    name: 'Pro AI',
    price: '$12',
    note: 'For account-based content workflows.',
    features: [
      'AI tools subscription',
      'Brand voice and content history',
      'PDF/CSV advanced exports',
      'Cross-device save and batch tools',
    ],
    cta: 'Open AI workspace',
    href: '/app/repurpose?preview=1',
    featured: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    note: 'For shared brand systems and reviews.',
    features: [
      'Shared brand voices',
      'Workspace permissions',
      'Higher AI usage limits',
      'Priority implementation support',
    ],
    cta: 'Contact sales',
    href: '/contact',
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Free calculators</Badge>
            <Badge variant="ai">AI tools subscription</Badge>
            <Badge variant="warning">Pro exports</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">Pricing</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Public calculators stay free and usable without login. AI generation,
            cross-device save, PDF/CSV advanced exports, and batch workflows belong
            to account and Pro plans.
          </p>
        </section>

        <section aria-label="Pricing plans" className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? 'border-brand-500 shadow-md' : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.featured ? <Badge variant="ai">Recommended</Badge> : null}
                </div>
                <p className="text-4xl font-bold leading-[44px] text-ink">{plan.price}</p>
                <p className="text-sm font-semibold text-neutral-600">{plan.note}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="grid gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm font-semibold text-neutral-700">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 text-success" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={
                    plan.featured
                      ? 'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600'
                      : 'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink'
                  }
                  href={plan.href}
                >
                  {plan.featured ? <Sparkles aria-hidden="true" size={16} /> : <CreditCard aria-hidden="true" size={16} />}
                  {plan.cta}
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold leading-7 text-ink">Plan boundary</h2>
          <p className="mt-2 text-sm leading-5 text-neutral-600">
            Calculator inputs, formulas, and basic results remain public and local.
            Account-backed AI workflows can save history, reuse brand voices, export
            advanced files, and run batches across devices.
          </p>
        </section>
      </Container>
    </main>
  );
}
