import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { RepurposeWorkspace } from '@/components/ai';
import { UsagePlanCard } from '@/components/billing';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getSessionFromRequest, getSessionFromSearchParams } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import { getPlanById } from '@/lib/plans';

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

interface ResolveRepurposePageSessionInput {
  searchParams: Record<string, string | undefined>;
  cookieHeader?: string;
  resolveRequestSession?: (
    request: Request,
  ) => Promise<ToolarsSession | null>;
}

function serializeCookieHeader(cookiesToSerialize: { name: string; value: string }[]) {
  return cookiesToSerialize
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join('; ');
}

export async function resolveRepurposePageSession({
  searchParams,
  cookieHeader,
  resolveRequestSession = getSessionFromRequest,
}: ResolveRepurposePageSessionInput) {
  const previewSession = getSessionFromSearchParams(searchParams);
  if (previewSession) return previewSession;
  if (!cookieHeader) return null;

  return resolveRequestSession(
    new Request('https://toolars.local/app/repurpose', {
      headers: {
        cookie: cookieHeader,
      },
    }),
  );
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
  const previewSession = getSessionFromSearchParams(params ?? {});
  const session =
    previewSession ??
    (await resolveRepurposePageSession({
      searchParams: params ?? {},
      cookieHeader: serializeCookieHeader((await cookies()).getAll()),
    }));

  if (!session) return <AuthGate />;

  const plan = getPlanById(session.planId);
  const remainingGenerations = plan.monthlyAiGenerations;

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section
          aria-label="AI workspace header"
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">Streaming workflow</Badge>
            <Badge variant="success">Preview account</Badge>
            <Badge>{plan.name} plan</Badge>
            <Badge>Brand voice</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-9 text-ink sm:text-4xl sm:leading-[44px]">
            AI Content Repurposer
          </h1>
          <p className="mt-3 hidden max-w-3xl text-base leading-6 text-neutral-600 sm:block">
            Turn one source into platform-native drafts for social, newsletters,
            articles, and community launches. Canceling preserves partial output.
          </p>
        </section>
        <section aria-label="Usage limits" className="hidden md:block">
          <UsagePlanCard
            planId={session.planId}
            remainingGenerations={remainingGenerations}
          />
        </section>
      </div>

      <RepurposeWorkspace planId={session.planId} />
    </section>
  );
}
