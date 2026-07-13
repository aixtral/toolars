"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { CheckCircle2, X } from "lucide-react";

type LocalDraftKind = "workflow" | "collection";

type LocalDraftRecord = {
  createdAt: string;
  kind: LocalDraftKind;
  name: string;
};

type LocalDraftModalButtonProps = {
  className: string;
  defaultName?: string;
  draftKind: LocalDraftKind;
  icon?: ReactNode;
  label: string;
  storageKey: string;
};

type BookmarkImportModalButtonProps = {
  className: string;
  label: string;
  storageKey: string;
};

export function LocalDraftModalButton({
  className,
  defaultName = "",
  draftKind,
  icon,
  label,
  storageKey
}: LocalDraftModalButtonProps) {
  const t = useTranslations();
  const [name, setName] = useState(defaultName);
  const [open, setOpen] = useState(false);
  const [savedName, setSavedName] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  function openModal() {
    setName(defaultName);
    setSavedName("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || typeof window === "undefined") return;

    const drafts = readLocalDrafts(storageKey);
    const nextDraft: LocalDraftRecord = {
      createdAt: new Date().toISOString(),
      kind: draftKind,
      name: trimmedName
    };
    window.localStorage.setItem(storageKey, JSON.stringify([...drafts, nextDraft]));
    setSavedName(trimmedName);
  }

  return (
    <>
      <button className={className} onClick={openModal} ref={triggerRef} type="button">
        {icon} {label}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="core-modal-overlay"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <section aria-labelledby={titleId} aria-modal="true" className="core-modal-dialog" ref={dialogRef} role="dialog" tabIndex={-1}>
                <div className="core-modal-head">
                  <h2 id={titleId}>{label}</h2>
                </div>
                <form className="core-modal-body" onSubmit={saveDraft}>
                  <label className="core-modal-field">
                    <span>{label}</span>
                    <input aria-label={label} onChange={(event) => setName(event.target.value)} required value={name} />
                  </label>
                  <button className="button button-solid" type="submit">
                    <CheckCircle2 size={15} aria-hidden="true" /> {label}
                  </button>
                  {savedName ? <p role="status">{savedName}</p> : null}
                </form>
                <footer className="core-modal-footer">
                  <span />
                  <button className="button button-outline-neutral" onClick={closeModal} type="button">
                    <X size={15} aria-hidden="true" /> {t("modal.close")}
                  </button>
                </footer>
              </section>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export function BookmarkImportModalButton({ className, label, storageKey }: BookmarkImportModalButtonProps) {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  function openModal() {
    setFile(null);
    setStatus("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  async function importBookmarks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || typeof window === "undefined") return;

    const urls = extractBookmarkUrls(await file.text());
    window.localStorage.setItem(storageKey, JSON.stringify(urls));
    setStatus(`${file.name} (${urls.length})`);
  }

  return (
    <>
      <button className={className} onClick={openModal} ref={triggerRef} type="button">
        {label}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="core-modal-overlay"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <section aria-labelledby={titleId} aria-modal="true" className="core-modal-dialog" ref={dialogRef} role="dialog" tabIndex={-1}>
                <div className="core-modal-head">
                  <h2 id={titleId}>{label}</h2>
                </div>
                <form className="core-modal-body" onSubmit={(event) => void importBookmarks(event)}>
                  <label className="core-modal-field">
                    <span>{label}</span>
                    <input accept="application/json,text/html" aria-label={label} onChange={(event) => setFile(event.target.files?.[0] ?? null)} required type="file" />
                  </label>
                  <button className="button button-solid" type="submit">
                    <CheckCircle2 size={15} aria-hidden="true" /> {label}
                  </button>
                  {status ? <p role="status">{status}</p> : null}
                </form>
                <footer className="core-modal-footer">
                  <span />
                  <button className="button button-outline-neutral" onClick={closeModal} type="button">
                    <X size={15} aria-hidden="true" /> {t("modal.close")}
                  </button>
                </footer>
              </section>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export function extractBookmarkUrls(source: string): string[] {
  const parsedUrls = extractUrlsFromJson(source);
  if (parsedUrls.length > 0) return parsedUrls;

  const htmlUrls = [...source.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  return uniqueHttpUrls(htmlUrls);
}

function readLocalDrafts(storageKey: string): LocalDraftRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isLocalDraftRecord) : [];
  } catch {
    return [];
  }
}

function isLocalDraftRecord(value: unknown): value is LocalDraftRecord {
  return Boolean(value && typeof value === "object" && "createdAt" in value && "kind" in value && "name" in value);
}

function extractUrlsFromJson(source: string): string[] {
  try {
    return uniqueHttpUrls(collectUrls(JSON.parse(source)));
  } catch {
    return [];
  }
}

function collectUrls(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectUrls);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  const directUrls = [record.url, record.href].filter((item): item is string => typeof item === "string");
  return [...directUrls, ...Object.values(record).flatMap(collectUrls)];
}

function uniqueHttpUrls(values: string[]): string[] {
  return [...new Set(values.filter((value) => /^https?:\/\//i.test(value)))];
}
