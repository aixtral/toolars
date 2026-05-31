import type { Metadata } from 'next';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Brand Voice | toolars',
  robots: { index: false, follow: false },
};

const voices = [
  {
    title: 'Founder operator',
    sample: 'Direct, useful, and credible. Leads with the practical outcome.',
    workspace: 'Default workspace',
    limit: 'Default voice',
  },
  {
    title: 'Educator',
    sample: 'Structured teaching style with examples and next steps.',
    workspace: 'Content team',
    limit: 'Pro voice',
  },
  {
    title: 'Product team',
    sample: 'Feature-focused, concise, and aligned to product launches.',
    workspace: 'Product marketing',
    limit: 'Team voice',
  },
] as const;

export default function BrandVoicePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Brand Voice</Badge>
          <Badge variant="warning">Plan limits</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-[44px] text-ink">Brand Voice</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Create, edit, delete, assign, and preview reusable voices for consistent
              AI output across workspaces.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Create voice
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {['Free: 1 voice', 'Pro: 10 voices', 'Team: shared voices'].map((limit) => (
          <Card key={limit}>
            <CardHeader>
              <CardTitle className="text-lg leading-6">{limit}</CardTitle>
            </CardHeader>
            <CardContent>
              Limits apply to active brand voices, workspace assignment, and team permissions.
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {voices.map((voice) => (
          <Card key={voice.title}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{voice.title}</CardTitle>
                <Badge variant={voice.limit === 'Default voice' ? 'success' : 'ai'}>
                  {voice.limit}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{voice.sample}</p>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold text-neutral-700">
                Workspace assignment: {voice.workspace}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Edit', 'Preview', 'Delete'].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
