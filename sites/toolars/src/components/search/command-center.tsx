"use client";

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X } from "lucide-react";
import { searchCommandResults, type CommandResult } from "@/lib/command-search";

const maxVisibleResults = 16;

interface CommandCenterProps {
  resultLimit?: number;
}

export function CommandCenter({ resultLimit = maxVisibleResults }: CommandCenterProps = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (event.key !== "Tab") return;

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
      const isCommandShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isCommandShortcut) {
        event.preventDefault();
        openCommandCenter();
        return;
      }

      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeCommandCenter();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }

      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        window.location.href = results[activeIndex].href;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, open, results]);

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
        aria-label="Open command search"
        aria-expanded={open}
        onClick={openCommandCenter}
      >
        <Search size={18} aria-hidden="true" />
        <span>Search tools, tasks, or paste anything...</span>
        <kbd className="kbd">CMD K</kbd>
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
            aria-label="Command Center"
            onKeyDown={handleDialogKeyDown}
          >
            <div className="command-search-row">
              <Search size={18} aria-hidden="true" />
              <input
                ref={inputRef}
                aria-label="Search tools and workflows"
                className="command-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools, tasks, or paste anything..."
                role="searchbox"
                value={query}
              />
              {query ? (
                <button className="command-icon-button" type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
              <button className="command-close-button" type="button" onClick={closeCommandCenter}>
                Esc
              </button>
            </div>

            <div className="command-results" role="listbox" aria-label="Command results">
              {results.length > 0 ? (
                query.trim() ? (
                  groupedResults.map(([group, items]) => (
                    <CommandGroup
                      activeIndex={activeIndex}
                      group={group}
                      items={items}
                      key={group}
                      results={results}
                      setActiveIndex={setActiveIndex}
                    />
                  ))
                ) : (
                  <section className="command-group">
                    <h2>Suggested</h2>
                    {results.map((result, index) => (
                      <CommandResultItem
                        active={index === activeIndex}
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
                  <strong>No matching tools or workflows</strong>
                  <p>Try a tool name, file type, or task like summarize pdf.</p>
                </div>
              )}
            </div>

            <footer className="command-footer">
              <span><ArrowUp size={13} aria-hidden="true" /> <ArrowDown size={13} aria-hidden="true" /> Navigate</span>
              <span><CornerDownLeft size={13} aria-hidden="true" /> Select</span>
              <span>Esc Close</span>
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
  results,
  setActiveIndex
}: {
  activeIndex: number;
  group: CommandResult["group"];
  items: CommandResult[];
  results: CommandResult[];
  setActiveIndex: (index: number) => void;
}) {
  return (
    <section className="command-group">
      <h2>{group}</h2>
      {items.map((result) => {
        const index = results.findIndex((item) => item.group === result.group && item.slug === result.slug);
        return (
          <CommandResultItem
            active={index === activeIndex}
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
  index,
  result,
  setActiveIndex
}: {
  active: boolean;
  index: number;
  result: CommandResult;
  setActiveIndex: (index: number) => void;
}) {
  return (
    <a
      className={`command-result ${active ? "is-active" : ""}`}
      href={result.href}
      onMouseEnter={() => setActiveIndex(index)}
    >
      <span className="command-result-icon">{result.group.charAt(0)}</span>
      <span className="command-result-copy">
        <strong>{result.title}</strong>
        <small>{result.meta}</small>
      </span>
      <span className="command-result-enter">
        <CornerDownLeft size={13} aria-hidden="true" /> Enter
      </span>
    </a>
  );
}

function getFocusableElements(dialog: HTMLElement | null) {
  if (!dialog) return [];

  return Array.from(
    dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])")
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
