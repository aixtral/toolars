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
  escape: "Escape",
  tab: "Tab",
  arrowDown: "ArrowDown",
  arrowUp: "ArrowUp",
  enter: "Enter"
} as const satisfies Record<string, KeyboardEvent["key"]>;
type CommandCenterKeyboardKey = (typeof keyboardKeys)[keyof typeof keyboardKeys];
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
  const fieldRef = useRef(null as HTMLDivElement | null);
  const inputRef = useRef(null as HTMLInputElement | null);
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const t = useTranslations("commandCenter");

  const results = useMemo(() => searchCommandResults(query, { limit: resultLimit }), [query, resultLimit]);
  const groupedResults = useMemo(() => groupResults(results), [results]);

  // Cmd/Ctrl+K moves focus straight into the inline search field.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === commandShortcutKey && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // The dropdown is non-modal: a pointer down anywhere outside the field closes it.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (fieldRef.current && event.target instanceof Node && !fieldRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (hasKeyboardKey(event, keyboardKeys.escape)) {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (hasKeyboardKey(event, keyboardKeys.tab)) {
      setOpen(false);
      return;
    }

    if (hasKeyboardKey(event, keyboardKeys.arrowDown) || hasKeyboardKey(event, keyboardKeys.arrowUp)) {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (hasKeyboardKey(event, keyboardKeys.arrowDown)) {
        setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      } else {
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
      return;
    }

    if (hasKeyboardKey(event, keyboardKeys.enter) && open && results[activeIndex]) {
      event.preventDefault();
      window.location.href = localizeCommandHref(results[activeIndex].href, localeCode);
    }
  };

  return (
    <div ref={fieldRef} className="command-trigger command-field" data-command-center>
      <Search size={18} aria-hidden="true" />
      <input
        ref={inputRef}
        aria-controls="command-center-results"
        aria-expanded={open}
        aria-label={t("aria.search")}
        className="command-input-inline"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleInputKeyDown}
        placeholder={t("placeholder")}
        role="combobox"
        value={query}
      />
      {query ? (
        <button
          className="command-icon-button"
          type="button"
          aria-label={t("aria.clear")}
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : (
        <kbd className="kbd">{t("kbd.command")}</kbd>
      )}

      {open ? (
        <div className="command-panel" role="dialog" aria-label={t("aria.dialog")}>
          <div className="command-results" id="command-center-results" role="listbox" aria-label={t("aria.results")}>
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
        </div>
      ) : null}
    </div>
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

function groupResults(results: CommandResult[]): Array<[CommandResult["group"], CommandResult[]]> {
  const groups = new Map<CommandResult["group"], CommandResult[]>();
  for (const result of results) {
    const items = groups.get(result.group) ?? [];
    items.push(result);
    groups.set(result.group, items);
  }
  return Array.from(groups.entries());
}
