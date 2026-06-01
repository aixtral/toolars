import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Mail, UserRound } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Create account | toolars',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">AI workspace</Badge>
            <Badge variant="success">Free calculators stay open</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[44px]">
            Create your toolars workspace
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
            AI tools are subscription-gated because they need account history,
            brand voice, usage limits, and saved outputs. Free calculators stay
            open without signup.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Start with account access</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="name">
                  Name
                </label>
                <div className="relative">
                  <UserRound aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <Input id="name" className="pl-10" placeholder="Your name" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="workspace">
                  Workspace
                </label>
                <div className="relative">
                  <Building2 aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <Input id="workspace" className="pl-10" placeholder="Company or project" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="register-email">
                  Email
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <Input id="register-email" type="email" className="pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Create workspace
              </button>
            </form>
            <p className="mt-4 text-sm text-neutral-600">
              Already have an account?{' '}
              <Link className="font-semibold text-brand-700 hover:underline" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
