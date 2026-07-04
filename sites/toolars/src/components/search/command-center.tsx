"use client";

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X } from "lucide-react";
import { searchCommandResults, type CommandResult } from "@/lib/command-search";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const maxVisibleResults = 16;

type CommandCenterKeyboardEvent = KeyboardEvent | ReactKeyboardEvent<HTMLElement>;
type CommandGroupMessageKey = "tools" | "workflows" | "collections";

const commandShortcutKey = "k" satisfies KeyboardEvent["key"];
const keyboardKeys = {
  tab: "Tab",
  escape: "Escape",
  arrowDown: "ArrowDown",
  arrowUp: "ArrowUp",
  enter: "Enter"
} as const satisfies Record<string, KeyboardEvent["key"]>;
type CommandCenterKeyboardKey = (typeof keyboardKeys)[keyof typeof keyboardKeys];
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
] as const;
const commandGroupMessageKeys = {
  Tools: "tools",
  Workflows: "workflows",
  Collections: "collections"
} as const satisfies Record<CommandResult["group"], CommandGroupMessageKey>;

interface CommandCenterProps {
  resultLimit?: number;
}

export function CommandCenter({ resultLimit = maxVisibleResults }: CommandCenterProps = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef(null as HTMLButtonElement | null);
  const dialogRef = useRef(null as HTMLElement | null);
  const inputRef = useRef(null as HTMLInputElement | null);
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const t = useTranslations("commandCenter");

  const results = useMemo(() => searchCommandResults(query, { limit: resultLimit }), [query, resultLimit]);
  const groupedResults = useMemo(() => groupResults(results), [results]);
  const openCommandCenter = () => {
    setOpen(true);
  };
  const closeCommandCenter = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!hasKeyboardKey(event, keyboardKeys.tab)) return;

    const focusableItems = getFocusableElements(dialogRef.current);
    if (focusableItems.length === 0) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandShortcut = event.key.toLowerCase() === commandShortcutKey && (event.metaKey || event.ctrlKey);

      if (isCommandShortcut) {
        event.preventDefault();
        openCommandCenter();
        return;
      }

      if (!open) return;

      if (hasKeyboardKey(event, keyboardKeys.escape)) {
        event.preventDefault();
        closeCommandCenter();
      }

      if (hasKeyboardKey(event, keyboardKeys.arrowDown)) {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      }

      if (hasKeyboardKey(event, keyboardKeys.arrowUp)) {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }

      if (hasKeyboardKey(event, keyboardKeys.enter) && results[activeIndex]) {
        event.preventDefault();
        window.location.href = localizeCommandHref(results[activeIndex].href, localeCode);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, localeCode, open, results]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="command-trigger"
        type="button"
        data-command-center
        aria-label={t("aria.open")}
        aria-expanded={open}
        onClick={openCommandCenter}
      >
        <Search size={18} aria-hidden="true" />
        <span>{t("placeholder")}</span>
        <kbd className="kbd">{t("kbd.command")}</kbd>
      </button>

      {open ? (
        <div className="command-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeCommandCenter();
        }}>
          <section
            ref={dialogRef}
            className="command-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={t("aria.dialog")}
            onKeyDown={handleDialogKeyDown}
          >
            <div className="command-search-row">
              <Search size={18} aria-hidden="true" />
              <input
                ref={inputRef}
                aria-label={t("aria.search")}
                className="command-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("placeholder")}
                role="searchbox"
                value={query}
              />
              {query ? (
                <button className="command-icon-button" type="button" aria-label={t("aria.clear")} onClick={() => setQuery("")}>
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
              <button className="command-close-button" type="button" aria-label={t("aria.close")} onClick={closeCommandCenter}>
                {t("kbd.escape")}
              </button>
            </div>

            <div className="command-results" role="listbox" aria-label={t("aria.results")}>
              {results.length > 0 ? (
                query.trim() ? (
                  groupedResults.map(([group, items]) => (
                    <CommandGroup
                      activeIndex={activeIndex}
                      group={group}
                      items={items}
                      key={group}
                      localeCode={localeCode}
                      results={results}
                      setActiveIndex={setActiveIndex}
                    />
                  ))
                ) : (
                  <section className="command-group">
                    <h2>{t("suggested")}</h2>
                    {results.map((result, index) => (
                      <CommandResultItem
                        active={index === activeIndex}
                        href={localizeCommandHref(result.href, localeCode)}
                        index={index}
                        key={`${result.group}-${result.slug}`}
                        result={result}
                        setActiveIndex={setActiveIndex}
                      />
                    ))}
                  </section>
                )
              ) : (
                <div className="command-empty">
                  <strong>{t("empty")}</strong>
                  <p>{t("emptyDescription")}</p>
                </div>
              )}
            </div>

            <footer className="command-footer">
              <span><ArrowUp size={13} aria-hidden="true" /> <ArrowDown size={13} aria-hidden="true" /> {t("footer.navigate")}</span>
              <span><CornerDownLeft size={13} aria-hidden="true" /> {t("footer.select")}</span>
              <span>{t("kbd.escape")} {t("footer.close")}</span>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

function CommandGroup({
  activeIndex,
  group,
  items,
  localeCode,
  results,
  setActiveIndex
}: {
  activeIndex: number;
  group: CommandResult["group"];
  items: CommandResult[];
  localeCode: LocaleCode;
  results: CommandResult[];
  setActiveIndex: (index: number) => void;
}) {
  const t = useTranslations("commandCenter");
  const groupKey = getCommandGroupMessageKey(group);
  return (
    <section className="command-group">
      <h2>{t(`groups.${groupKey}`)}</h2>
      {items.map((result) => {
        const index = results.findIndex((item) => {
          return item.group === result.group && item.slug === result.slug;
        });
        return (
          <CommandResultItem
            active={index === activeIndex}
            href={localizeCommandHref(result.href, localeCode)}
            index={index}
            key={`${result.group}-${result.slug}`}
            result={result}
            setActiveIndex={setActiveIndex}
          />
        );
      })}
    </section>
  );
}

function CommandResultItem({
  active,
  href,
  index,
  result,
  setActiveIndex
}: {
  active: boolean;
  href: string;
  index: number;
  result: CommandResult;
  setActiveIndex: (index: number) => void;
}) {
  const t = useTranslations("commandCenter");
  const groupLabel = t(`groups.${getCommandGroupMessageKey(result.group)}`);

  return (
    <a
      className={`command-result ${active ? "is-active" : ""}`}
      href={href}
      onMouseEnter={() => setActiveIndex(index)}
    >
      <span className="command-result-icon">{groupLabel.charAt(0)}</span>
      <span className="command-result-copy">
        <strong>{result.title}</strong>
        <small>{result.meta}</small>
      </span>
      <span className="command-result-enter">
        <CornerDownLeft size={13} aria-hidden="true" /> {t("footer.enter")}
      </span>
    </a>
  );
}

function localizeCommandHref(href: string, locale: LocaleCode) {
  return href.startsWith("/") ? localizePath(href, locale) : href;
}

function hasKeyboardKey(event: CommandCenterKeyboardEvent, key: CommandCenterKeyboardKey) {
  return event.key === key;
}

function getCommandGroupMessageKey(group: CommandResult["group"]) {
  return commandGroupMessageKeys[group];
}

function getFocusableElements(dialog: HTMLElement | null) {
  if (!dialog) return [];

  return Array.from(dialog.querySelectorAll(focusableSelector.join(","))).filter(
    (element): element is HTMLElement => element instanceof HTMLElement
  );
}

function groupResults(results: CommandResult[]): Array<[CommandResult["group"], CommandResult[]]> {
  const groups = new Map<CommandResult["group"], CommandResult[]>();
  for (const result of results) {
    const items = groups.get(result.group) ?? [];
    items.push(result);
    groups.set(result.group, items);
  }
  return Array.from(groups.entries());
}
