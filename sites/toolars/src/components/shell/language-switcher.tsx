"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { DEFAULT_LOCALE, isValidLocale, localizeCurrentPathForLocale, LOCALES, ROUTED_LOCALES, type LocaleCode } from "@/lib/i18n";
import { updateToolarsWorkspacePreferences } from "@/lib/supabase/toolars-supabase-workspace-client";

const LANGUAGE_MENU_WIDTH = 120;

type LanguageSwitcherProps = Readonly<{
  variant?: "dropdown" | "inline";
}>;

export function LanguageSwitcher({ variant = "dropdown" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(undefined as CSSProperties | undefined);
  const ref = useRef(null as HTMLDivElement | null);
  const triggerRef = useRef(null as HTMLButtonElement | null);
  const menuRef = useRef(null as HTMLUListElement | null);
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setMenuStyle(undefined);
      return;
    }

    function updateMenuPosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 166;
      const menuWidth = Math.min(LANGUAGE_MENU_WIDTH, window.innerWidth - 24);
      const left = Math.max(12, Math.min(triggerRect.right - menuWidth, window.innerWidth - menuWidth - 12));
      const belowTop = triggerRect.bottom + 8;
      const top = belowTop + menuHeight <= window.innerHeight - 12 ? belowTop : Math.max(12, triggerRect.top - menuHeight - 8);

      setMenuStyle({
        left,
        position: "fixed",
        top,
        width: menuWidth
      });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  function buildHref(targetLocale: LocaleCode): string {
    return localizeCurrentPathForLocale(pathname, targetLocale);
  }

  async function changeLocale(event: ReactMouseEvent<HTMLAnchorElement>, targetLocale: LocaleCode) {
    event.preventDefault();
    await updateToolarsWorkspacePreferences({ locale: targetLocale, preferences: {} });
    window.location.assign(buildHref(targetLocale));
  }

  const currentLocale = LOCALES.find((l) => l.code === localeCode) ?? LOCALES[0];

  if (variant === "inline") {
    return (
      <div className="language-switcher language-switcher-inline" data-language-switcher="rustdesk-inline-language-list-v1">
        <ul
          className="language-switcher-inline-list"
          data-language-panel="rustdesk-inline-list"
          role="listbox"
          aria-label={t("switchLanguage")}
        >
          {ROUTED_LOCALES.map((l) => (
            <li key={l.code}>
              <a
                href={buildHref(l.code)}
                className={`language-switcher-option language-switcher-inline-option ${l.code === localeCode ? "is-active" : ""}`}
                role="option"
                aria-selected={l.code === localeCode}
                onClick={(event) => void changeLocale(event, l.code)}
              >
                <span className="language-switcher-option-label">{l.label}</span>
                <LanguageOptionCheck active={l.code === localeCode} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="language-switcher" data-language-switcher="rustdesk-language-select-v2" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="language-switcher-trigger"
        aria-haspopup="listbox"
        aria-label={`${t("switchLanguage")}: ${currentLocale.label}`}
        aria-expanded={open}
        title={currentLocale.label}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe size={16} aria-hidden="true" />
        <span className="language-switcher-current-copy" aria-hidden="true">
          <span className="language-switcher-current-label">{currentLocale.label}</span>
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open ? (
        <ul
          ref={menuRef}
          className="language-switcher-menu"
          data-language-panel="rustdesk-native-list"
          role="listbox"
          aria-label={`${t("switchLanguage")}: ${currentLocale.label}`}
          style={menuStyle}
        >
          {ROUTED_LOCALES.map((l) => (
            <li key={l.code}>
              <a
                href={buildHref(l.code)}
                className={`language-switcher-option ${l.code === localeCode ? "is-active" : ""}`}
                role="option"
                aria-selected={l.code === localeCode}
                onClick={(event) => {
                  setOpen(false);
                  void changeLocale(event, l.code);
                }}
              >
                <span className="language-switcher-option-label">{l.label}</span>
                <LanguageOptionCheck active={l.code === localeCode} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function LanguageOptionCheck({ active }: { active: boolean }) {
  return (
    <span className={`language-switcher-option-check ${active ? "" : "is-hidden"}`} aria-hidden="true">
      {active ? <Check size={14} aria-hidden="true" /> : null}
    </span>
  );
}
