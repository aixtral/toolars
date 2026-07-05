'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, Command, CornerDownLeft, Search, X } from 'lucide-react';
import { getPopularTools } from '@/data/tools';
import type { ToolCategory, ToolDefinition, ToolType } from '@/data/types';
import { searchTools } from '@/lib/search';
import { categoryCards } from '@/lib/discovery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/classnames';

type PaletteTab = 'all' | 'calculator' | 'ai' | 'health' | 'finance' | 'articles';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = ['BMI', 'mortgage payment', 'compound interest', 'brand voice'];

function optionsForTab(tab: PaletteTab): { type?: ToolType; category?: ToolCategory } {
  if (tab === 'calculator') return { type: 'calculator' };
  if (tab === 'ai') return { type: 'ai' };
  if (tab === 'health') return { category: 'body' };
  if (tab === 'finance') return { category: 'finance' };
  return {};
}

function defaultTools() {
  return getPopularTools(6);
}

function ToolResult({ tool, index, active }: { tool: ToolDefinition; index: number; active: boolean }) {
  return (
    <div
      id={`command-result-${index}`}
      role="option"
      aria-selected={active}
      className={cn(
        'rounded-lg border border-transparent transition-colors',
        active ? 'border-brand-500 bg-neutral-50' : 'hover:border-neutral-200 hover:bg-neutral-50',
      )}
    >
      <a href={tool.route} className="grid grid-cols-[40px_1fr_auto] items-center gap-3 p-3 text-left">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-semibold text-brand-700">
          {tool.title.slice(0, 1)}
        </span>
        <span className="min-w-0">
          <span className="block text-base font-semibold text-ink">{tool.title}</span>
          <span className="line-clamp-1 block text-sm text-neutral-600">{tool.description}</span>
        </span>
        <Badge variant={tool.type === 'ai' ? 'ai' : 'default'}>
          {tool.type === 'ai' ? 'AI' : 'Free'}
        </Badge>
      </a>
    </div>
  );
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const t = useTranslations('search');
  const tNav = useTranslations('nav');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PaletteTab>('all');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs: readonly { id: PaletteTab; label: string }[] = [
    { id: 'all', label: t('tabAll') },
    { id: 'calculator', label: t('tabCalculators') },
    { id: 'ai', label: t('tabAi') },
    { id: 'health', label: t('tabHealth') },
    { id: 'finance', label: t('tabFinance') },
    { id: 'articles', label: t('tabArticles') },
  ];

  const results = useMemo(() => {
    if (activeTab === 'articles') return [];
    if (!query.trim()) return defaultTools();
    return searchTools(query, optionsForTab(activeTab));
  }, [activeTab, query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  const showEmpty = query.trim().length > 0 && results.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 px-4 py-6 backdrop-blur-sm sm:py-12">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('dialogLabel')}
        className="mx-auto flex max-h-[calc(100vh-48px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
      >
        <div className="border-b border-neutral-200 p-4">
          <label className="sr-only" htmlFor="command-search">
            {t('searchboxLabel')}
          </label>
          <div className="grid grid-cols-[20px_1fr] items-center gap-2 rounded-lg border border-neutral-300 px-3 focus-within:ring-2 focus-within:ring-brand-500">
            <Search aria-hidden="true" className="text-neutral-500" size={18} strokeWidth={2} />
            <input
              ref={inputRef}
              id="command-search"
              role="searchbox"
              type="search"
              value={query}
              aria-label={t('searchboxLabel')}
              aria-activedescendant={activeIndex >= 0 ? `command-result-${activeIndex}` : undefined}
              aria-controls="command-results"
              placeholder={tNav('searchPlaceholder')}
              className="min-h-11 w-full border-0 bg-transparent py-2 text-base text-ink focus-visible:outline-none"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActiveIndex((current) => Math.min(current + 1, results.length - 1));
                }
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActiveIndex((current) => Math.max(current - 1, 0));
                }
                if (event.key === 'Enter' && activeIndex >= 0) {
                  const route = results[activeIndex]?.route;
                  if (route) window.location.href = route;
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 px-4 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              className={cn(
                'min-h-11 shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                activeTab === tab.id
                  ? 'border-brand-500 bg-neutral-50 text-brand-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-500',
              )}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveIndex(-1);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 md:grid-cols-[1fr_220px]">
          <div id="command-results" role="listbox" aria-label={t('resultsLabel')} className="space-y-2">
            {results.map((tool, index) => (
              <ToolResult
                key={tool.slug}
                tool={tool}
                index={index}
                active={activeIndex === index}
              />
            ))}

            {showEmpty ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="text-xl font-semibold text-ink">{t('emptyTitle')}</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {t('emptyBody', { query })}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  <li>{t('emptySuggestionSpell')}</li>
                  <li>
                    <Link className="font-semibold text-brand-700 hover:underline" href="/tools">
                      {t('emptySuggestionBrowse')}
                    </Link>
                  </li>
                  <li>{t('emptySuggestionArticles')}</li>
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4 border-t border-neutral-200 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            <section>
              <h3 className="text-xs font-semibold uppercase text-neutral-600">{t('popularSearches')}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    className="min-h-11 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-700 hover:border-brand-500"
                    onClick={() => {
                      setQuery(search);
                      setActiveIndex(-1);
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase text-neutral-600">Categories</h3>
              <div className="mt-2 space-y-2">
                {categoryCards().slice(0, 4).map((category) => (
                  <a
                    key={category.slug}
                    href={category.route}
                    className="block rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-brand-500"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
              <h3 className="font-semibold text-ink">{t('shortcutsHeading')}</h3>
              <div className="mt-2 grid gap-2">
                <span className="inline-flex items-center gap-2">
                  <ArrowUpDown aria-hidden="true" size={16} strokeWidth={2} />
                  {t('shortcutsArrows')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CornerDownLeft aria-hidden="true" size={16} strokeWidth={2} />
                  {t('shortcutsEnter')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Command aria-hidden="true" size={16} strokeWidth={2} />
                  {t('shortcutsCmd')}
                </span>
              </div>
            </section>
          </aside>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600">
          <span>{t('footer')}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('close')}
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
