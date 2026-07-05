import type { Metadata } from 'next';
import { FileText, Mail, MessagesSquare, Share2 } from 'lucide-react';
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
    title: t('metadataTemplates'),
    robots: { index: false, follow: false },
  };
}

const templates = [
  {
    title: 'Launch Thread',
    group: 'Social',
    outputType: 'Twitter Thread',
    platforms: 'Twitter, LinkedIn, Facebook',
    length: '450-700 words',
    tones: ['Professional', 'Viral'],
    icon: Share2,
  },
  {
    title: 'Founder Update',
    group: 'Community',
    outputType: 'Community post',
    platforms: 'Reddit, Indie Hackers, Jike',
    length: '250-500 words',
    tones: ['Casual', 'Professional'],
    icon: MessagesSquare,
  },
  {
    title: 'Newsletter Brief',
    group: 'Email',
    outputType: 'Newsletter',
    platforms: 'Newsletter, WeChat',
    length: '600-900 words',
    tones: ['Professional', 'Casual'],
    icon: Mail,
  },
  {
    title: 'SEO Article Outline',
    group: 'Long-form',
    outputType: 'Article',
    platforms: 'Medium, Zhihu, WeChat',
    length: '900-1400 words',
    tones: ['Professional'],
    icon: FileText,
  },
] as const;

export default async function TemplatesPage({
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
          <Badge variant="ai">{t('templatesBadge')}</Badge>
          <Badge>{t('templatesGroupSocial')}</Badge>
          <Badge>{t('templatesGroupLongForm')}</Badge>
          <Badge>{t('templatesGroupEmail')}</Badge>
          <Badge>{t('templatesGroupCommunity')}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">{t('templatesHeading')}</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">{t('templatesBody')}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => {
          const Icon = template.icon;

          return (
            <Card key={template.title}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-accent-ai">
                    <Icon aria-hidden="true" size={20} strokeWidth={2} />
                  </span>
                  <Badge variant="ai">{template.group}</Badge>
                </div>
                <CardTitle>{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-neutral-600">{t('labelOutputType')}</dt>
                    <dd className="font-bold text-ink">{template.outputType}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-neutral-600">{t('labelPlatformSupport')}</dt>
                    <dd className="text-right font-bold text-ink">{template.platforms}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-neutral-600">{t('labelEstimatedLength')}</dt>
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
                <button
                  type="button"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  {t('useTemplate')}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </section>
  );
}
