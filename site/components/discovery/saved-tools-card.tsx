'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { readSavedCalculatorResults } from '@/lib/storage';
import type { StoredCalculatorResult } from '@/lib/storage';

const maxShown = 5;

interface SavedToolEntry {
  slug: string;
  title: string;
  route: string;
  createdAt: string;
}

/**
 * Reads the calculator results saved to localStorage by CalculatorWorkspace
 * and renders the most recent entries (deduplicated by slug, newest first).
 *
 * The home page is a Server Component and cannot read localStorage, so this
 * client component owns the "recently saved" surface honestly — an empty state
 * is shown when the visitor has not saved anything yet, rather than a
 * hard-coded list of tools pretending to be their recent activity.
 */
function dedupeBySlug(results: readonly StoredCalculatorResult[]): SavedToolEntry[] {
  const seen = new Set<string>();
  const entries: SavedToolEntry[] = [];

  for (const result of results) {
    if (seen.has(result.slug)) continue;
    seen.add(result.slug);
    entries.push({
      slug: result.slug,
      title: result.title,
      route: `/tools/${result.slug}`,
      createdAt: result.createdAt,
    });
  }

  return entries.slice(0, maxShown);
}

export function SavedToolsCard() {
  const t = useTranslations('savedTools');
  const [entries, setEntries] = useState<SavedToolEntry[]>([]);

  useEffect(() => {
    function refresh() {
      setEntries(dedupeBySlug(readSavedCalculatorResults()));
    }

    refresh();

    // Sync across tabs and when CalculatorWorkspace writes a new result.
    window.addEventListener('storage', refresh);
    window.addEventListener('toolars:saved-results-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('toolars:saved-results-changed', refresh);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {entries.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm leading-5 text-neutral-600">
              {t('empty')}
            </p>
            <Link
              className="inline-flex min-h-11 items-center rounded-lg border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              href="/tools"
            >
              {t('browseCta')}
            </Link>
          </div>
        ) : (
          entries.map((entry) => (
            <Link
              key={entry.slug}
              href={entry.route}
              className="text-sm font-semibold text-neutral-700 hover:text-brand-700"
            >
              {entry.title}
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
