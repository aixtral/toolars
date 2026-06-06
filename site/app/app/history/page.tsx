import type { Metadata } from 'next';
import { Copy, FileSearch, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

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
    source: 'Product update URL',
  },
  {
    title: 'Founder update draft',
    status: 'Canceled',
    platform: 'Twitter Thread',
    tone: 'Casual',
    date: 'May 30, 2026',
    source: 'Long-form note',
  },
  {
    title: 'Community launch note',
    status: 'Failed',
    platform: 'Reddit Post',
    tone: 'Viral',
    date: 'May 29, 2026',
    source: 'Release brief',
  },
] as const;

const filterLabels = [
  ['Filter by status', 'Status'],
  ['Filter by platform', 'Platform'],
  ['Filter by date', 'Date'],
  ['Filter by tone', 'Tone'],
] as const;

export default function HistoryPage() {
  return (
    <section aria-label="History operations" className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">History</Badge>
          <Badge>Detail drawer</Badge>
          <Badge>Copy</Badge>
          <Badge>Regenerate</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[44px]">
          Content History
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Search previous AI jobs, filter by status, platform, date, and tone,
          then reopen the detail drawer for source snapshots, copy, or regeneration.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="grid gap-3 p-5 lg:grid-cols-[1fr_auto_auto_auto_auto]">
              <Input aria-label="Search history" type="search" placeholder="Search history..." />
              {filterLabels.map(([ariaLabel, label]) => (
                <Button key={label} aria-label={ariaLabel} size="sm" variant="secondary">
                  <SlidersHorizontal aria-hidden="true" size={15} />
                  {label}
                </Button>
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
                <CardContent className="space-y-4">
                  <div className="grid gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm sm:grid-cols-3">
                    <span>
                      <strong className="text-ink">Source:</strong> {job.source}
                    </span>
                    <span>
                      <strong className="text-ink">Outputs:</strong> 2 variants
                    </span>
                    <span>
                      <strong className="text-ink">Save:</strong> local preview
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary">
                      <FileSearch aria-hidden="true" size={15} />
                      Open detail
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Copy aria-hidden="true" size={15} />
                      Copy outputs
                    </Button>
                    <Button size="sm" variant="secondary">
                      <RotateCcw aria-hidden="true" size={15} />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>

        <Card aria-label="Saved output detail">
          <CardHeader>
            <CardTitle className="text-lg leading-6">Saved output detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Source snapshot</p>
              <p className="mt-2 font-semibold text-ink">
                Calculator launch recap from a product update URL, stored as local preview
                history until account sync is enabled.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Available actions</p>
              <p className="mt-2 text-sm font-semibold text-neutral-700">
                Copy selected output, regenerate from the original source, or save to Pro
                cross-device history in the account-backed workflow.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
