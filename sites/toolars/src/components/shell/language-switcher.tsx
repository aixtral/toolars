"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { DEFAULT_LOCALE, isValidLocale, localizeCurrentPathForLocale, LOCALES, type LocaleCode } from "@/lib/i18n";

/**
 * Compact language switcher for the topbar. Shows a globe icon + current
 * language code, expands to show all supported locales on click.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function buildHref(targetLocale: LocaleCode): string {
    return localizeCurrentPathForLocale(pathname, targetLocale);
  }

  const currentLocale = LOCALES.find((l) => l.code === localeCode) ?? LOCALES[0];

  return (
    <div className="language-switcher" data-language-switcher="locale-pill-v3" ref={ref}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-haspopup="listbox"
        aria-label={`${t("switchLanguage")}: ${currentLocale.label}`}
        aria-expanded={open}
        title={currentLocale.label}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe size={16} aria-hidden="true" />
        <span className="language-switcher-current" aria-hidden="true">
          {currentLocale.shortLabel}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open ? (
        <ul className="language-switcher-menu" role="listbox" aria-label={`${t("switchLanguage")}: ${currentLocale.label}`}>
          {LOCALES.map((l) => (
            <li key={l.code}>
              <a
                href={buildHref(l.code)}
                className={`language-switcher-option ${l.code === localeCode ? "is-active" : ""}`}
                role="option"
                aria-selected={l.code === localeCode}
              >
                <span className="language-switcher-option-copy">
                  <span>{l.label}</span>
                  <small>{l.englishLabel}</small>
                </span>
                <span className="language-switcher-option-meta">
                  <span>{l.shortLabel}</span>
                  {l.code === localeCode ? <Check size={14} aria-hidden="true" /> : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
