import type { Metadata } from 'next';
import Link from 'next/link';
import { LockKeyhole, Mail } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Sign in | toolars',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
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
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <Input id="email" type="email" className="pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <Input id="password" type="password" className="pl-10" placeholder="Password" />
                </div>
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Sign in
              </button>
            </form>
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
