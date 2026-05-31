import type { Metadata } from 'next';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Content History | toolars',
  robots: { index: false, follow: false },
};

const jobs = [
  {
    title: 'Calculator launch recap',
    status: 'Completed',
    platform: 'LinkedIn Post',
    tone: 'Professional',
    date: 'May 31, 2026',
  },
  {
    title: 'Founder update draft',
    status: 'Canceled',
    platform: 'Twitter Thread',
    tone: 'Casual',
    date: 'May 30, 2026',
  },
  {
    title: 'Community launch note',
    status: 'Failed',
    platform: 'Reddit Post',
    tone: 'Viral',
    date: 'May 29, 2026',
  },
] as const;

export default function HistoryPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">History</Badge>
          <Badge>Copy</Badge>
          <Badge>Regenerate</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">Content History</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Search previous AI jobs, filter by status, platform, date, and tone,
          then reopen details for copy or regeneration.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-5 lg:grid-cols-[1fr_auto_auto_auto]">
          <Input aria-label="Search history" type="search" placeholder="Search history..." />
          {['Status', 'Platform', 'Date', 'Tone'].map((filter) => (
            <button
              key={filter}
              type="button"
              className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            >
              {filter}
            </button>
          ))}
        </CardContent>
      </Card>

      <section className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.title}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="mt-1 text-sm text-neutral-600">
                    {job.platform} · {job.tone} · {job.date}
                  </p>
                </div>
                <Badge variant={job.status === 'Completed' ? 'success' : 'warning'}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['Open detail', 'Copy outputs', 'Regenerate'].map((action) => (
                <button
                  key={action}
                  type="button"
                  className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                >
                  {action}
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
