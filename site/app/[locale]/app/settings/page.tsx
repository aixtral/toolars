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
    title: t('metadataSettings'),
    robots: { index: false, follow: false },
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ai');

  const sections = [
    [t('sectionProfileTitle'), t('sectionProfileCopy')],
    [t('sectionWorkspaceTitle'), t('sectionWorkspaceCopy')],
    [t('sectionApiKeysTitle'), t('sectionApiKeysCopy')],
    [t('sectionNotificationsTitle'), t('sectionNotificationsCopy')],
    [t('sectionDataExportTitle'), t('sectionDataExportCopy')],
    [t('sectionDangerZoneTitle'), t('sectionDangerZoneCopy')],
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">{t('settingsBadge')}</Badge>
          <Badge>{t('settingsBadgeAccount')}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">{t('settingsHeading')}</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">{t('settingsBody')}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, copy]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{copy}</p>
              <button
                type="button"
                className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                {t('actionManage')}
              </button>
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
