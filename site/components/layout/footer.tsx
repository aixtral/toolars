import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/container';

const footerGroups = [
  {
    title: 'Tools',
    links: [
      { label: 'All tools', href: '/tools' },
      { label: 'Health calculators', href: '/categories/health' },
      { label: 'Finance calculators', href: '/categories/finance' },
      { label: 'Compare results', href: '/compare' },
    ],
  },
  {
    title: 'AI workspace',
    links: [
      { label: 'AI tools', href: '/ai' },
      { label: 'Open app', href: '/app/repurpose' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'English', href: '/en' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-neutral-200 bg-white"
      role="contentinfo"
    >
      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(220px,1fr)_2fr]">
          <section aria-label="toolars footer summary" className="max-w-sm">
            <Link href="/" className="text-2xl font-semibold text-ink" aria-label="toolars home">
              toolars
            </Link>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Free calculators, account-gated AI tools, and local-first utility
              workflows for operators who need answers without friction.
            </p>
            <Link
              href="/tools"
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            >
              Browse all tools
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
            </Link>
          </section>

          <nav
            aria-label="Footer navigation"
            className="grid gap-6 sm:grid-cols-3"
          >
            {footerGroups.map((group) => (
              <section key={group.title} aria-label={`${group.title} links`}>
                <h2 className="text-xs font-bold uppercase tracking-normal text-neutral-500">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-10 items-center text-sm font-semibold text-neutral-700 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-5 text-xs font-semibold text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 toolars. Built for fast, private calculations and AI reuse.</p>
          <p>Calculators stay free. Pro features are clearly marked.</p>
        </div>
      </Container>
    </footer>
  );
}
