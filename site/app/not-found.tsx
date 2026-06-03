import Link from 'next/link';
import { ArrowRight, Home, Search, Wrench } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge } from '@/components/ui/badge';

const recoveryLinks = [
  {
    label: 'Tool directory',
    href: '/tools',
    description: 'Search 73 calculators by category, task, or keyword.',
    icon: Search,
  },
  {
    label: 'Open AI tools',
    href: '/ai',
    description: 'Repurpose content, manage brand voice, and review AI workflows.',
    icon: Wrench,
  },
  {
    label: 'Contact toolars',
    href: '/contact',
    description: 'Reach support, partnerships, or product feedback.',
    icon: Home,
  },
];

export default function NotFound() {
  return (
    <main className="bg-neutral-50">
      <Container className="py-12 sm:py-16">
        <section
          aria-label="Not found recovery"
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <Badge variant="warning">404</Badge>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[44px] text-ink">
            We could not find that tool
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
            Search the directory or return to a known workspace. Toolars keeps
            public calculators free and routes AI workflows through the app.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Browse all tools
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
            </Link>
          </div>
        </section>

        <section
          aria-label="Recovery links"
          className="mt-6 grid gap-3 md:grid-cols-3"
        >
          {recoveryLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-500"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-brand-700">
                  <Icon aria-hidden="true" size={18} strokeWidth={2} />
                </span>
                <span className="mt-4 block text-base font-bold text-ink">{item.label}</span>
                <span className="mt-2 block text-sm leading-6 text-neutral-600">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </section>
      </Container>
    </main>
  );
}
