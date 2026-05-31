import Link from 'next/link';
import type { ToolCategoryDefinition } from '@/data/types';

interface CategoryCardProps {
  category: Pick<ToolCategoryDefinition, 'title' | 'description' | 'route'>;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link
      href={category.route}
      className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-500 hover:shadow-toolars"
    >
      <span className="text-xs font-semibold uppercase text-brand-700">{count} tools</span>
      <h3 className="mt-2 text-lg font-semibold leading-6 text-ink">{category.title}</h3>
      <p className="mt-2 text-sm leading-5 text-neutral-600">{category.description}</p>
    </Link>
  );
}
