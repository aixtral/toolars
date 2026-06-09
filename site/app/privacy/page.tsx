import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy | toolars',
  description: 'Toolars privacy principles for calculators, local data, accounts, and AI workflows.',
};

const sections = [
  [
    'Calculator privacy',
    'Anonymous calculator inputs stay local unless you explicitly save or sync through an account-backed workflow.',
  ],
  [
    'AI workspace data',
    'Account-backed AI workflows can store prompts, outputs, brand voice, usage state, and subscription context.',
  ],
  [
    'Exports and sync',
    'PDF/CSV exports, cross-device save, and batch tools require account context so files and history can be managed.',
  ],
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Local calculators</Badge>
            <Badge variant="ai">Account AI workflows</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">Privacy</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Toolars separates anonymous calculator use from account-backed AI workflows.
            The goal is simple: free utility can stay local, while Pro features make
            storage and sync explicit.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {sections.map(([title, copy]) => (
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
