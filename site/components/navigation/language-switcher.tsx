'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { routing, type LaunchLocale } from '@/i18n/routing';
import { LOCALE_CONFIGS } from '@/data/locales';
import { cn } from '@/components/ui/classnames';

/**
 * Language switcher for the launch locales (en/zh/es/pt).
 *
 * Uses next-intl's router to swap the active locale while staying on the same
 * pathname. The current locale is detected via `useLocale()`; selecting an
 * option calls `router.replace(pathname, { locale })` which preserves the route
 * and only changes the locale prefix.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as LaunchLocale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Only the launch locales are routable. Filter LOCALE_CONFIGS to match.
  const launchConfigs = LOCALE_CONFIGS.filter((config) =>
    routing.locales.includes(config.code as LaunchLocale),
  );
  const activeConfig = launchConfigs.find((config) => config.code === locale);

  function selectLocale(nextLocale: LaunchLocale) {
    setOpen(false);
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-transparent px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('languageSwitcher')}
        onClick={() => setOpen((current) => !current)}
      >
        <Globe aria-hidden="true" size={16} strokeWidth={2} />
        {!compact ? (
          <span className="hidden lg:inline">{activeConfig?.nativeName ?? locale}</span>
        ) : null}
        <ChevronDown aria-hidden="true" size={14} strokeWidth={2} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t('languageSwitcher')}
          className="absolute right-0 top-full z-40 mt-2 min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {launchConfigs.map((config) => (
            <li key={config.code}>
              <button
                type="button"
                role="option"
                aria-selected={config.code === locale}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50',
                  config.code === locale
                    ? 'font-bold text-brand-700'
                    : 'font-semibold text-neutral-700',
                )}
                onClick={() => selectLocale(config.code as LaunchLocale)}
              >
                <span>{config.nativeName}</span>
                <span className="text-xs font-medium uppercase text-neutral-400">
                  {config.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
