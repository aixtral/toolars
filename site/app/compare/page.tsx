import type { Metadata } from 'next';
import { Download, GitCompareArrows, Save } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Compare Saved Calculator Results | toolars',
  description:
    'Compare locally saved calculator results and understand Pro export and cross-device sync boundaries.',
};

const savedResults = [
  ['BMI Calculator', '22.4 BMI', 'Healthy range'],
  ['Mortgage Calculator', '$2,184/mo', '30-year fixed estimate'],
  ['Compound Interest', '$18,420', '10-year projection'],
] as const;

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="space-y-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Local-only</Badge>
            <Badge>Anonymous calculators</Badge>
            <Badge variant="warning">Pro exports</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">
            Compare saved calculator results
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Compare calculator outputs saved in this browser. Local-only storage
            keeps anonymous calculator work private; account sync and advanced
            exports can become Pro actions.
          </p>
        </section>

        <section aria-label="Local comparison" className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GitCompareArrows aria-hidden="true" size={18} />
                <CardTitle>Saved result table</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold text-neutral-700">
                Local-only comparison uses browser storage until the user chooses
                account-backed sync.
              </p>
              {savedResults.map(([tool, value, note]) => (
                <div
                  key={tool}
                  className="grid gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm sm:grid-cols-[1fr_auto_1fr]"
                >
                  <span className="font-bold text-ink">{tool}</span>
                  <span className="font-bold text-brand-700">{value}</span>
                  <span className="font-semibold text-neutral-600">{note}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                <Save aria-hidden="true" size={16} />
                Save locally
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <Download aria-hidden="true" size={16} />
                Export CSV
              </button>
              <p className="text-sm leading-5 text-neutral-600">
                PDF/CSV advanced exports and cross-device comparison sync are Pro
                boundaries; basic comparison stays available locally.
              </p>
            </CardContent>
          </Card>
        </section>
      </Container>
    </main>
  );
}
