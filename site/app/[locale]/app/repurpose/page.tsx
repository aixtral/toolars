import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { RepurposeWorkspace } from '@/components/ai';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getSession, getPreviewSessionFromSearchParams } from '@/lib/auth';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ai' });
  return {
    title: t('metadataRepurpose'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

interface RepurposePageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    preview?: string;
  }>;
}

function AuthGate({
  aiTool,
  accountRequired,
  heading,
  body,
  signIn,
  createAccount,
  continuePreview,
}: {
  aiTool: string;
  accountRequired: string;
  heading: string;
  body: string;
  signIn: string;
  createAccount: string;
  continuePreview: string;
}) {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">{aiTool}</Badge>
            <Badge>{accountRequired}</Badge>
          </div>
          <CardTitle className="text-3xl leading-10">{heading}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="max-w-2xl text-base leading-6 text-neutral-600">{body}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
              href="/login?redirect=/app/repurpose"
            >
              {signIn}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              href="/register?redirect=/app/repurpose"
            >
              {createAccount}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              href="/app/repurpose?preview=1"
            >
              {continuePreview}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function RepurposePage({ params, searchParams }: RepurposePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ai');

  const sp = await searchParams;

  // 1. Real Supabase session wins.
  const session = await getSession();

  // 2. Dev backdoor (`?preview=1`) only when no real session and only in dev.
  const effectiveSession =
    session ?? getPreviewSessionFromSearchParams(sp ?? {});

  // 3. No session at all — bounce to login. The AuthGate below is only shown
  //    in dev where the preview backdoor is available but wasn't requested.
  if (!effectiveSession) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      redirect(`/${locale}/login?redirect=/${locale}/app/repurpose`);
    }
    // Supabase not configured: show the gate so the page degrades gracefully
    // instead of looping through an unconfigured auth flow.
    return (
      <AuthGate
        aiTool={t('authGateAiTool')}
        accountRequired={t('accountRequired')}
        heading={t('authGateHeading')}
        body={t('authGateBody')}
        signIn={t('authGateSignIn')}
        createAccount={t('authGateCreateAccount')}
        continuePreview={t('authGateContinuePreview')}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">{t('streamingWorkflow')}</Badge>
          <Badge variant="success">{t('previewAccount')}</Badge>
          <Badge>{t('brandVoiceBadge')}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">{t('repurposeHeading')}</h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">{t('repurposeBody')}</p>
      </div>

      <RepurposeWorkspace planId={effectiveSession.planId} />
    </section>
  );
}
