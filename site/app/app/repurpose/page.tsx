import type { Metadata } from 'next';
import Link from 'next/link';
import { RepurposeWorkspace } from '@/components/ai';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AI Content Repurposer | toolars',
  description:
    'Repurpose one source into platform-native content with tone, brand voice, model, streaming, and cancellation controls.',
  robots: {
    index: false,
    follow: false,
  },
};

interface RepurposePageProps {
  searchParams?: Promise<{
    preview?: string;
  }>;
}

function AuthGate() {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">AI tool</Badge>
            <Badge>Account required</Badge>
          </div>
          <CardTitle className="text-3xl leading-10">
            Sign in to use AI Content Repurposer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="max-w-2xl text-base leading-6 text-neutral-600">
            AI generation, history sync, brand voices, and subscription limits require an
            account. Public calculators stay free and do not use this gate.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              href="/register"
            >
              Create account
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              href="/app/repurpose?preview=1"
            >
              Continue in preview
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function RepurposePage({ searchParams }: RepurposePageProps) {
  const params = await searchParams;
  const previewAuthenticated = params?.preview === '1';

  if (!previewAuthenticated) return <AuthGate />;

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Streaming workflow</Badge>
          <Badge variant="success">Preview account</Badge>
          <Badge>Brand voice</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">
          AI Content Repurposer
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Turn one source into platform-native drafts for social, newsletters,
          articles, and community launches. Canceling preserves partial output.
        </p>
      </div>

      <RepurposeWorkspace />
    </section>
  );
}
