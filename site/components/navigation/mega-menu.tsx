import { getPopularTools } from '@/data/tools';
import { Badge } from '@/components/ui/badge';
import { Command } from 'lucide-react';
import { categoryCards } from '@/lib/discovery';

const solutions = [
  { title: 'Fast Calculator Lookup', href: '/tools' },
  { title: 'Creator Repurposing', href: '/ai' },
  { title: 'Personal Finance Planning', href: '/categories/finance' },
];

const resources = [
  { title: 'Guides', href: '/blog' },
  { title: 'Compare Saved Results', href: '/compare' },
  { title: 'Pricing', href: '/pricing' },
];

export function MegaMenu() {
  const popularTools = getPopularTools(5);
  const categories = categoryCards();

  return (
    <div
      role="region"
      aria-label="Tools menu"
      className="absolute left-1/2 top-full z-40 mt-3 grid w-[min(920px,calc(100vw-32px))] -translate-x-1/2 gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-lg md:grid-cols-[1.2fr_1fr_1fr]"
    >
      <section>
        <h2 className="text-lg font-semibold text-ink">Popular Calculators</h2>
        <div className="mt-3 space-y-2">
          {popularTools.map((tool) => (
            <a
              key={tool.slug}
              href={tool.route}
              className="grid grid-cols-[36px_1fr] gap-3 rounded-lg border border-transparent p-2 hover:border-brand-500 hover:bg-neutral-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-sm font-semibold text-brand-700">
                {tool.title.slice(0, 1)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{tool.title}</span>
                <span className="line-clamp-1 block text-sm text-neutral-600">
                  {tool.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Categories</h2>
        <div className="mt-3 grid gap-2">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={category.route}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-brand-500 hover:text-ink"
            >
              {category.title}
            </a>
          ))}
        </div>
      </section>

      <div className="grid gap-4">
        <section>
          <h2 className="text-lg font-semibold text-ink">Solutions</h2>
          <div className="mt-3 space-y-2">
            {solutions.map((solution) => (
              <a
                key={solution.href}
                href={solution.href}
                className="block rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-brand-500"
              >
                {solution.title}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Resources</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {resources.map((resource) => (
              <a key={resource.href} href={resource.href}>
                <Badge>{resource.title}</Badge>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
          <h2 className="font-semibold text-ink">Recent tools</h2>
          <p className="mt-1">Recent tools appear here after you use calculators.</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-brand-700">
            <Command aria-hidden="true" size={16} strokeWidth={2} />
            Press ⌘K to search anything
          </p>
        </section>
      </div>
    </div>
  );
}
