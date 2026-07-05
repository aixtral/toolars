import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return { title: t('loginTitle') };
}

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');

  const sp = (await searchParams) ?? {};
  const redirectTo =
    typeof sp.redirect === 'string' && sp.redirect.length > 0
      ? sp.redirect
      : `/${locale}/app/repurpose`;
  const showError = sp.error === 'invalid';
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!hasSupabase) {
    return (
      <section className="mx-auto max-w-md py-16">
        <Card>
          <CardHeader>
            <Badge>{t('loginTitle')}</Badge>
            <CardTitle className="mt-2 text-2xl">{t('loginHeading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-neutral-600">{t('missingEnv')}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md py-16">
      <Card>
        <CardHeader>
          <Badge>{t('loginTitle')}</Badge>
          <CardTitle className="mt-2 text-2xl">{t('loginHeading')}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{t('loginBody')}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {showError ? (
            <p
              role="alert"
              className="rounded-lg border border-danger bg-red-50 px-3 py-2 text-sm font-medium text-danger"
            >
              {t('invalidCredentials')}
            </p>
          ) : null}
          <form action={signIn} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="redirect" value={redirectTo} />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink" htmlFor="login-email">
                {t('email')}
              </label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('emailPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink" htmlFor="login-password">
                {t('password')}
              </label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                placeholder={t('passwordPlaceholder')}
              />
            </div>
            <Button type="submit" className="w-full">
              {t('signInSubmit')}
            </Button>
          </form>

          <div className="relative py-1 text-center">
            <span className="bg-white px-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              {t('orContinueWith')}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-neutral-200"
            />
          </div>
          <form className="grid grid-cols-2 gap-3">
            <Button formAction={signInWithGoogle} variant="secondary">
              {t('google')}
            </Button>
            <Button formAction={signInWithGithub} variant="secondary">
              {t('github')}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            {t('needAccount')}{' '}
            <Link
              className="font-semibold text-brand-600 hover:text-brand-700"
              href="/register"
            >
              {t('createAccountLink')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

async function signIn(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const locale = String(formData.get('locale') ?? 'en');
  const redirectTo = String(formData.get('redirect') ?? `/${locale}/app/repurpose`);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/${locale}/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }
  redirect(redirectTo);
}

async function signInWithGoogle() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: '/auth/callback' },
  });
}

async function signInWithGithub() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: '/auth/callback' },
  });
}
