import type { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '@/components/auth';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { safeAuthNextPath } from '@/lib/auth/redirect';

export const metadata: Metadata = {
  title: 'Sign in | toolars',
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeAuthNextPath(params?.next);

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">Account</Badge>
            <Badge variant="warning">Preview shell</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">Sign in to toolars</h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            Sign in is required for AI generation, brand voice, history sync,
            analytics, Pro exports, and cross-device save. Calculators remain free
            without an account.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Workspace access</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm nextPath={nextPath} />
            <p className="mt-4 text-sm text-neutral-600">
              New to toolars?{' '}
              <Link className="font-semibold text-brand-700 hover:underline" href="/register">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
