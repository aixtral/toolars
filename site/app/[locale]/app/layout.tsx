import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BarChart3, Files, History, Mic, Settings, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout';
import { Badge, Button } from '@/components/ui';
import { getSession } from '@/lib/auth';
import { signOut } from '@/app/[locale]/app/_actions/sign-out';

export default async function AiAppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ai');
  const authT = await getTranslations('auth');

  const session = await getSession();

  const appNav = [
    { label: t('navRepurpose'), href: '/app/repurpose', icon: Sparkles },
    { label: t('navTemplates'), href: '/app/templates', icon: Files },
    { label: t('navBrandVoice'), href: '/app/brand-voice', icon: Mic },
    { label: t('navHistory'), href: '/app/history', icon: History },
    { label: t('navAnalytics'), href: '/app/analytics', icon: BarChart3 },
    { label: t('navSettings'), href: '/app/settings', icon: Settings },
  ] as const;

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:block">
            <div className="flex flex-wrap gap-2">
              <Badge variant="ai">{t('aiSaaS')}</Badge>
            </div>
            <h2 className="mt-4 text-xl font-bold leading-7 text-ink">{t('workspaceTitle')}</h2>
            <p className="mt-2 text-sm leading-5 text-neutral-600">{t('workspaceBody')}</p>
          </section>

          <nav
            aria-label={t('navLabel')}
            className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0"
          >
            {appNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:border-brand-500 hover:text-ink"
                  href={item.href}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <section className="hidden rounded-lg border border-neutral-200 bg-white p-4 text-sm leading-5 text-neutral-600 shadow-sm lg:block">
            <p className="font-bold text-ink">{t('workspaceCard')}</p>
            <p className="mt-2">{t('workspaceCardBody')}</p>
            {session ? (
              <div className="mt-3 space-y-2">
                <p className="truncate text-xs text-neutral-500" title={session.email}>
                  {session.email}
                </p>
                <form action={signOut}>
                  <Button type="submit" variant="secondary" size="sm" className="w-full">
                    {authT('signOut')}
                  </Button>
                </form>
              </div>
            ) : null}
          </section>
        </aside>

        <div className="min-w-0">{children}</div>
      </Container>
    </main>
  );
}
