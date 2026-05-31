import type { Metadata } from 'next';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Performance Analytics | toolars',
  robots: { index: false, follow: false },
};

const metrics = [
  ['Total tool uses', '1,284', '+18% this week'],
  ['AI outputs generated', '426', '14 platforms'],
  ['Credits used', '8,920', '72% of plan'],
] as const;

const platforms = [
  ['LinkedIn', '34%'],
  ['Twitter Thread', '26%'],
  ['Newsletter', '18%'],
  ['Community', '22%'],
] as const;

const tones = [
  ['Professional', '51%'],
  ['Casual', '31%'],
  ['Viral', '18%'],
] as const;

export default function AnalyticsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Analytics</Badge>
          <Badge variant="warning">Pro</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">
          Performance Analytics
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Track usage, generated outputs, credits, platform mix, tone mix, and
          recent workspace activity.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(([label, value, note]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-base leading-6">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold leading-[44px] text-ink">{value}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-600">{note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {platforms.map(([label, value]) => (
              <div key={label} className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <span className="font-semibold text-neutral-700">{label}</span>
                <span className="font-bold text-ink">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tone breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tones.map(([label, value]) => (
              <div key={label} className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <span className="font-semibold text-neutral-700">{label}</span>
                <span className="font-bold text-ink">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {['Generated newsletter brief', 'Copied LinkedIn post', 'Canceled Twitter thread'].map((item) => (
            <div key={item} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold text-neutral-700">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
