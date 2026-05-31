import { Container } from '@/components/layout';
import { ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { aiDirectoryTools, platformSupport } from '@/lib/discovery';
import { buildDirectoryMetadata } from '@/lib/seo';

export const metadata = buildDirectoryMetadata('ai');

export default function AiToolsDirectoryPage() {
  const tools = aiDirectoryTools();

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[220px_1fr_300px]">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {['Repurpose', 'Templates', 'Brand Voice', 'History', 'Analytics', 'Settings'].map((item) => (
            <a
              key={item}
              href="/app/repurpose"
              className="block rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:border-brand-500 hover:text-ink"
            >
              {item}
            </a>
          ))}
        </aside>

        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="ai">Account workspace</Badge>
              <Badge variant="warning">Pro exports</Badge>
              <Badge>Public directory</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">AI Tools Directory</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Account-based AI tools for turning one source into platform-native
              content, reusable templates, brand voice profiles, history, and analytics.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ['Input sources', 'URL, text, notes, and reusable templates.'],
              ['Output controls', 'Tone, platform, model, and brand voice.'],
              ['Workspace memory', 'History, analytics, and saved voices.'],
            ].map(([title, copy]) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>{copy}</CardContent>
              </Card>
            ))}
          </section>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Usage plan</CardTitle>
            </CardHeader>
            <CardContent>
              Calculator pages remain free. AI generation, history sync, brand voice, batch tools, and advanced exports are account or Pro features.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform support</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {platformSupport.map((platform) => (
                <span key={platform} className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-700">
                  {platform}
                </span>
              ))}
            </CardContent>
          </Card>
        </aside>
      </Container>
    </main>
  );
}
