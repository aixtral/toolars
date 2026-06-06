import type { Metadata } from 'next';
import {
  Clock3,
  FileText,
  Filter,
  Mail,
  MessagesSquare,
  MousePointer2,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Template Library | toolars',
  robots: { index: false, follow: false },
};

const templates = [
  {
    title: 'Launch Thread',
    group: 'Social',
    outputType: 'Twitter Thread',
    platforms: 'Twitter, LinkedIn, Facebook',
    length: '450-700 words',
    tones: ['Professional', 'Viral'],
    usage: 'Most used',
    icon: Share2,
  },
  {
    title: 'Founder Update',
    group: 'Community',
    outputType: 'Community post',
    platforms: 'Reddit, Indie Hackers, Jike',
    length: '250-500 words',
    tones: ['Casual', 'Professional'],
    usage: 'Team ready',
    icon: MessagesSquare,
  },
  {
    title: 'Newsletter Brief',
    group: 'Email',
    outputType: 'Newsletter',
    platforms: 'Newsletter, WeChat',
    length: '600-900 words',
    tones: ['Professional', 'Casual'],
    usage: 'High retention',
    icon: Mail,
  },
  {
    title: 'SEO Article Outline',
    group: 'Long-form',
    outputType: 'Article',
    platforms: 'Medium, Zhihu, WeChat',
    length: '900-1400 words',
    tones: ['Professional'],
    usage: 'Long-form',
    icon: FileText,
  },
] as const;

const filterRows = [
  ['Group', 'Social, Long-form, Email, Community'],
  ['Output type', 'Threads, posts, newsletters, articles'],
  ['Platform coverage', '14 destinations mapped to templates'],
] as const;

export default function TemplatesPage() {
  return (
    <section aria-label="Template workspace" className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">AI templates</Badge>
          <Badge variant="success">Workflow-ready templates</Badge>
          <Badge variant="warning">Pro preview</Badge>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <h1 className="text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[44px]">
              Template Library
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Workflow-ready templates for social launches, long-form articles,
              newsletters, and community posts with platform, tone, and length metadata.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Templates</p>
              <p className="mt-1 text-2xl font-bold text-ink">24</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Platforms</p>
              <p className="mt-1 text-2xl font-bold text-ink">14</p>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => {
            const Icon = template.icon;

            return (
              <Card key={template.title}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-accent-ai">
                      <Icon aria-hidden="true" size={20} strokeWidth={2} />
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Badge variant="ai">{template.group}</Badge>
                      <Badge>{template.usage}</Badge>
                    </div>
                  </div>
                  <CardTitle>{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="font-semibold text-neutral-600">Output type</dt>
                      <dd className="font-bold text-ink">{template.outputType}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="font-semibold text-neutral-600">Platform support</dt>
                      <dd className="text-right font-bold text-ink">{template.platforms}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="font-semibold text-neutral-600">Estimated length</dt>
                      <dd className="font-bold text-ink">{template.length}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-2">
                    {template.tones.map((tone) => (
                      <span
                        key={tone}
                        className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-700"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                  <Button
                    aria-label={`Use ${template.title} template`}
                    className="w-full"
                    size="sm"
                  >
                    <MousePointer2 aria-hidden="true" size={16} />
                    Use template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <aside className="space-y-4">
          <Card aria-label="Template filters">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter aria-hidden="true" size={18} />
                <CardTitle className="text-lg leading-6">Template filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filterRows.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card aria-label="Template usage signals">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles aria-hidden="true" size={18} />
                <CardTitle className="text-lg leading-6">Template usage signals</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <span className="font-semibold text-neutral-700">Most used</span>
                <span className="font-bold text-ink">Launch Thread</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <span className="font-semibold text-neutral-700">Avg setup</span>
                <span className="inline-flex items-center gap-1 font-bold text-ink">
                  <Clock3 aria-hidden="true" size={15} /> 35 sec
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </section>
  );
}
