import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ai' });
  return {
    title: t('metadataHistory'),
    robots: { index: false, follow: false },
  };
}

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

export default async function HistoryPage({
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
          <Badge variant="ai">{t('historyBadge')}</Badge>
          <Badge>{t('historyBadgeCopy')}</Badge>
          <Badge>{t('historyBadgeRegenerate')}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">{t('historyHeading')}</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">{t('historyBody')}</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-5 lg:grid-cols-[1fr_auto_auto_auto]">
          <Input
            aria-label={t('searchHistoryLabel')}
            type="search"
            placeholder={t('searchHistoryPlaceholder')}
          />
          {[t('filterStatus'), t('filterPlatform'), t('filterDate'), t('filterTone')].map((filter) => (
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
              {[t('actionOpenDetail'), t('actionCopyOutputs'), t('actionRegenerate')].map((action) => (
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
