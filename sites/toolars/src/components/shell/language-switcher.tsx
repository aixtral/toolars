"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LOCALES } from "@/lib/i18n";

/**
 * Compact language switcher for the topbar. Shows a globe icon + current
 * language code, expands to show all supported locales on click.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function buildHref(targetLocale: string): string {
    // Replace the first path segment (current locale) with the target locale
    const segments = pathname.split("/");
    if (segments.length > 1 && segments[1] === locale) {
      segments[1] = targetLocale;
      return segments.join("/");
    }
    // Fallback: prepend target locale
    return `/${targetLocale}${pathname}`;
  }

  const currentLocale = LOCALES.find((l) => l.code === locale);

  return (
    <div className="language-switcher" ref={ref}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-label="Switch language"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe size={16} aria-hidden="true" />
        <span>{currentLocale?.code.toUpperCase().split("-")[0] ?? "EN"}</span>
      </button>

      {open ? (
        <ul className="language-switcher-menu" role="listbox">
          {LOCALES.map((l) => (
            <li key={l.code}>
              <a
                href={buildHref(l.code)}
                className={`language-switcher-option ${l.code === locale ? "is-active" : ""}`}
                role="option"
                aria-selected={l.code === locale}
              >
                <span>{l.label}</span>
                {l.code === locale ? <Check size={14} aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
