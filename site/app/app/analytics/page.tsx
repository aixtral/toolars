import type { Metadata } from 'next';
import { Activity, BarChart3, Gauge, TrendingUp } from 'lucide-react';
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

const trend = ['42', '58', '63', '71', '65', '84', '92'] as const;

export default function AnalyticsPage() {
  return (
    <section aria-label="Analytics cockpit" className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Analytics</Badge>
          <Badge variant="warning">Pro</Badge>
          <Badge variant="success">Usage over time</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[44px]">
          Performance Analytics
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Track usage over time, generated outputs, credits, platform mix, tone mix,
          and recent workspace activity.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(([label, value, note]) => (
          <Card key={label}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base leading-6">{label}</CardTitle>
                <Gauge aria-hidden="true" className="text-accent-ai" size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold leading-[44px] text-ink">{value}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-600">{note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card aria-label="Usage trend">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp aria-hidden="true" size={18} />
              <CardTitle>Usage trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-semibold text-neutral-700">7 day trend by AI outputs.</p>
            <div className="flex h-36 items-end gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              {trend.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  aria-label={`Day ${index + 1}: ${value} outputs`}
                  className="flex flex-1 items-end"
                >
                  <span
                    className="w-full rounded-t-md bg-brand-500"
                    style={{ height: `${Number(value)}%` }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity aria-hidden="true" size={18} />
              <CardTitle>Recent activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {['Generated newsletter brief', 'Copied LinkedIn post', 'Canceled Twitter thread'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold text-neutral-700"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 aria-hidden="true" size={18} />
              <CardTitle>Platform breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {platforms.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-neutral-700">{label}</span>
                  <span className="font-bold text-ink">{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-neutral-200">
                  <span className="block h-2 rounded-full bg-brand-500" style={{ width: value }} />
                </div>
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
              <div key={label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-neutral-700">{label}</span>
                  <span className="font-bold text-ink">{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-neutral-200">
                  <span className="block h-2 rounded-full bg-accent-ai" style={{ width: value }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
