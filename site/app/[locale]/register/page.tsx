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
  return { title: t('registerTitle') };
}

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');

  const sp = (await searchParams) ?? {};
  const redirectTo =
    typeof sp.redirect === 'string' && sp.redirect.length > 0
      ? sp.redirect
      : `/${locale}/app/repurpose`;
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!hasSupabase) {
    return (
      <section className="mx-auto max-w-md py-16">
        <Card>
          <CardHeader>
            <Badge>{t('registerTitle')}</Badge>
            <CardTitle className="mt-2 text-2xl">{t('registerHeading')}</CardTitle>
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
          <Badge>{t('registerTitle')}</Badge>
          <CardTitle className="mt-2 text-2xl">{t('registerHeading')}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{t('registerBody')}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <form action={signUp} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="redirect" value={redirectTo} />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink" htmlFor="register-email">
                {t('email')}
              </label>
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('emailPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink" htmlFor="register-password">
                {t('password')}
              </label>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder={t('passwordPlaceholder')}
              />
            </div>
            <Button type="submit" className="w-full">
              {t('signUpSubmit')}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            {t('haveAccount')}{' '}
            <Link
              className="font-semibold text-brand-600 hover:text-brand-700"
              href="/login"
            >
              {t('signInLink')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

async function signUp(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const locale = String(formData.get('locale') ?? 'en');
  const redirectTo = String(formData.get('redirect') ?? `/${locale}/app/repurpose`);

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(
      `/${locale}/register?error=invalid&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }
  redirect(`/${locale}/login?registered=1`);
}
