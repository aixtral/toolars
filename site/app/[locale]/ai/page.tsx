import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { ToolCard } from '@/components/tools';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { aiDirectoryTools, platformSupport } from '@/lib/discovery';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ai' });
  return {
    title: t('directoryHeading'),
    description: t('directoryDescription'),
    alternates: buildAlternates('/ai'),
  };
}

export default async function AiToolsDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ai');

  const tools = aiDirectoryTools();
  const sidebarNavItems = [
    { label: t('navRepurpose'), href: '/app/repurpose' },
    { label: t('navTemplates'), href: '/app/repurpose' },
    { label: t('navBrandVoice'), href: '/app/repurpose' },
    { label: t('navHistory'), href: '/app/repurpose' },
    { label: t('navAnalytics'), href: '/app/repurpose' },
    { label: t('navSettings'), href: '/app/repurpose' },
  ];
  const featureCards = [
    { title: t('featuredInputSources'), copy: t('featuredInputSourcesBody') },
    { title: t('featuredOutputControls'), copy: t('featuredOutputControlsBody') },
    { title: t('featuredWorkspaceMemory'), copy: t('featuredWorkspaceMemoryBody') },
  ];

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[220px_1fr_300px]">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:border-brand-500 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="ai">Account workspace</Badge>
              <Badge variant="warning">Pro exports</Badge>
              <Badge>Public directory</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-[44px]">{t('directoryHeading')}</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              {t('directoryDescription')}
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {featureCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>{card.copy}</CardContent>
              </Card>
            ))}
          </section>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t('usagePlan')}</CardTitle>
            </CardHeader>
            <CardContent>
              Calculator pages remain free. AI generation, history sync, brand voice, batch tools, and advanced exports are account or Pro features.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('platformSupport')}</CardTitle>
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
