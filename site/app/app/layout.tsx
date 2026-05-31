import Link from 'next/link';
import { BarChart3, Files, History, Mic, Settings, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout';
import { Badge } from '@/components/ui';

const appNav = [
  { label: 'Repurpose', href: '/app/repurpose?preview=1', icon: Sparkles },
  { label: 'Templates', href: '/app/templates', icon: Files },
  { label: 'Brand Voice', href: '/app/brand-voice', icon: Mic },
  { label: 'History', href: '/app/history', icon: History },
  { label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/app/settings', icon: Settings },
] as const;

export default function AiAppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <Container className="grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:block">
            <div className="flex flex-wrap gap-2">
              <Badge variant="ai">AI SaaS</Badge>
              <Badge variant="warning">Pro</Badge>
            </div>
            <h2 className="mt-4 text-xl font-bold leading-7 text-ink">toolars workspace</h2>
            <p className="mt-2 text-sm leading-5 text-neutral-600">
              Account-gated content repurposing, brand voice, history, and analytics.
            </p>
          </section>

          <nav
            aria-label="AI app navigation"
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
            <p className="font-bold text-ink">Usage plan</p>
            <p className="mt-2">48 AI generations left in the Pro preview workspace.</p>
          </section>
        </aside>

        <div className="min-w-0">{children}</div>
      </Container>
    </main>
  );
}
