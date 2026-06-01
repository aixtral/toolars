import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact toolars',
  description: 'Contact toolars for product, support, partnerships, and business inquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge>Support</Badge>
            <Badge variant="ai">Partnerships</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">Contact toolars</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Product, support, partnerships, and business questions can start here.
            We prioritize issues that affect calculator accuracy, privacy, and AI workflow reliability.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Product', 'Calculator requests, formula corrections, and workflow feedback.'],
            ['Support', 'Account access, Pro exports, billing context, and AI workspace help.'],
            ['Partnerships', 'Editorial, distribution, or enterprise workspace conversations.'],
          ].map(([title, copy]) => (
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
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Link className="font-semibold text-brand-700 hover:underline" href="mailto:hello@toolars.com">
              hello@toolars.com
            </Link>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
