import type { Metadata } from 'next';
import { CheckCircle2, Mic2, PenLine, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

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
    confidence: '96%',
  },
  {
    title: 'Educator',
    sample: 'Structured teaching style with examples and next steps.',
    workspace: 'Content team',
    limit: 'Pro voice',
    confidence: '89%',
  },
  {
    title: 'Product team',
    sample: 'Feature-focused, concise, and aligned to product launches.',
    workspace: 'Product marketing',
    limit: 'Team voice',
    confidence: '92%',
  },
] as const;

const planLimits = [
  ['Free: 1 voice', 'Single active voice and manual assignment.'],
  ['Pro: 10 voices', 'Workspace assignment, default voice, and saved previews.'],
  ['Team: shared voices', 'Shared voices, permissions, and review workflows.'],
] as const;

export default function BrandVoicePage() {
  return (
    <section aria-label="Voice governance" className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Brand Voice</Badge>
          <Badge variant="success">Default voice active</Badge>
          <Badge variant="warning">Plan limits</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[44px]">
              Brand Voice
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Create, edit, delete, assign, and preview reusable voices for consistent
              AI output across workspaces. The default voice is applied to new drafts.
            </p>
          </div>
          <Button size="sm">
            <Mic2 aria-hidden="true" size={16} />
            Create voice
          </Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <section aria-label="Voice plan capacity" className="grid gap-4 md:grid-cols-3">
            {planLimits.map(([limit, copy]) => (
              <Card key={limit}>
                <CardHeader>
                  <CardTitle className="text-lg leading-6">{limit}</CardTitle>
                </CardHeader>
                <CardContent>
                  {copy} Workspace assignment and default controls stay visible in preview.
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
                  <dl className="grid gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="font-semibold text-neutral-600">Workspace assignment</dt>
                      <dd className="text-right font-bold text-ink">{voice.workspace}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="font-semibold text-neutral-600">Match confidence</dt>
                      <dd className="font-bold text-ink">{voice.confidence}</dd>
                    </div>
                  </dl>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary">
                      <PenLine aria-hidden="true" size={15} />
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary">
                      Preview
                    </Button>
                    <Button size="sm" variant="secondary">
                      <CheckCircle2 aria-hidden="true" size={15} />
                      Set as default
                    </Button>
                    <Button size="sm" variant="danger">
                      <Trash2 aria-hidden="true" size={15} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>

        <Card aria-label="Voice preview">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" size={18} />
              <CardTitle className="text-lg leading-6">Voice preview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Sample tone preview</p>
              <p className="mt-2 font-semibold text-ink">
                Practical, precise, and quietly confident. Avoid hype and lead with the
                job the user can complete next.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Governance</p>
              <p className="mt-2 text-sm font-semibold text-neutral-700">
                Default voice: Founder operator. Team edits require owner review in the
                account-backed workflow.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
