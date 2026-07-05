import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ai' });
  return {
    title: t('metadataBrandVoice'),
    robots: { index: false, follow: false },
  };
}

const voices = [
  {
    title: 'Founder operator',
    sample: 'Direct, useful, and credible. Leads with the practical outcome.',
    workspace: 'Default workspace',
  },
  {
    title: 'Educator',
    sample: 'Structured teaching style with examples and next steps.',
    workspace: 'Content team',
  },
  {
    title: 'Product team',
    sample: 'Feature-focused, concise, and aligned to product launches.',
    workspace: 'Product marketing',
  },
] as const;

export default async function BrandVoicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ai');

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">{t('brandVoiceBadgeTitle')}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-[44px] text-ink">{t('brandVoiceHeading')}</h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">{t('brandVoiceBody')}</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {t('createVoice')}
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {voices.map((voice) => (
          <Card key={voice.title}>
            <CardHeader>
              <CardTitle>{voice.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{voice.sample}</p>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold text-neutral-700">
                {t('workspaceAssignment')} {voice.workspace}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[t('actionEdit'), t('actionPreview'), t('actionDelete')].map((action) => (
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
