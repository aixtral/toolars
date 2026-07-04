"use client";

import { ClipboardList, Copy, Gauge, History, Link2, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  buildSlugHistory,
  generateSlugBatch,
  type SlugBatchResult,
  type SlugGeneratorOptions,
  type SlugHistoryEntry,
  type SlugSeparator
} from "@/lib/tools/slug-generator";

const separators: Array<{ value: SlugSeparator; labelKey: "hyphen" | "underscore" | "dot" }> = [
  { value: "-", labelKey: "hyphen" },
  { value: "_", labelKey: "underscore" },
  { value: ".", labelKey: "dot" }
];

export function SlugGeneratorWorkspace() {
  const t = useTranslations("tools.slug-generator.workspace");
  const [sourceText, setSourceText] = useState("");
  const [separator, setSeparator] = useState("-" as SlugSeparator);
  const [lowercase, setLowercase] = useState(true);
  const [transliterate, setTransliterate] = useState(true);
  const [deduplicate, setDeduplicate] = useState(true);
  const [maxLength, setMaxLength] = useState(0);
  const [result, setResult] = useState(null as SlugBatchResult | null);
  const [history, setHistory] = useState([] as SlugHistoryEntry[]);
  const hasSource = sourceText.trim().length > 0;

  const options: SlugGeneratorOptions = {
    separator,
    lowercase,
    transliterate,
    maxLength,
    deduplicate
  };

  const generateSlugs = () => {
    const nextResult = generateSlugBatch(sourceText, options);
    setResult(nextResult);
    setHistory((current) =>
      buildSlugHistory(
        current,
        nextResult.rows.map((row) => ({ slug: row.slug, source: row.source }))
      )
    );
  };

  const updateSourceText = (value: string) => {
    setSourceText(value);
    setResult(null);
  };

  const clearWorkspace = () => {
    setSourceText("");
    setResult(null);
  };

  const copyOutput = () => {
    if (!result?.output || typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(result.output);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="slug-generator"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row">
            <span className="badge local">{t("badges.local")}</span>
            <span>{t("localCopy")}</span>
          </div>
          <div className="detail-row">
            <span className="badge">{t("badges.seo")}</span>
            <span>{t("seoCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <Link2 size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="slug-generator-source">
            {t("sourceLabel")}
            <textarea
              className="input"
              id="slug-generator-source"
              onChange={(event) => updateSourceText(event.target.value)}
              placeholder={t("sourcePlaceholder")}
              rows={8}
              value={sourceText}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasSource} onClick={generateSlugs} type="button">
              <Link2 size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
            <button className="button" disabled={!hasSource && !result} onClick={clearWorkspace} type="button">
              <Trash2 size={16} aria-hidden="true" /> {t("clearButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("optionsTitle")}</h2>
              <p className="tool-description">{t("optionsDescription")}</p>
            </div>
            <RotateCcw size={18} aria-hidden="true" />
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="slug-generator-separator">
              {t("separatorLabel")}
              <select
                className="input"
                id="slug-generator-separator"
                onChange={(event) => {
                  setSeparator(event.target.value as SlugSeparator);
                  setResult(null);
                }}
                value={separator}
              >
                {separators.map((item) => (
                  <option key={item.value} value={item.value}>
                    {t(`separators.${item.labelKey}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="slug-generator-max-length">
              {t("maxLengthLabel")}
              <input
                className="input"
                id="slug-generator-max-length"
                min={0}
                onChange={(event) => {
                  setMaxLength(Number(event.target.value));
                  setResult(null);
                }}
                step={5}
                type="number"
                value={maxLength}
              />
            </label>
          </div>

          <div className="detail-row-list" style={{ marginTop: 18 }}>
            <label className="detail-row" htmlFor="slug-generator-lowercase">
              <span className="badge">{t("badges.case")}</span>
              <span>{t("lowercaseLabel")}</span>
              <input
                checked={lowercase}
                id="slug-generator-lowercase"
                onChange={(event) => {
                  setLowercase(event.target.checked);
                  setResult(null);
                }}
                type="checkbox"
              />
            </label>
            <label className="detail-row" htmlFor="slug-generator-transliterate">
              <span className="badge">{t("badges.ascii")}</span>
              <span>{t("transliterateLabel")}</span>
              <input
                checked={transliterate}
                id="slug-generator-transliterate"
                onChange={(event) => {
                  setTransliterate(event.target.checked);
                  setResult(null);
                }}
                type="checkbox"
              />
            </label>
            <label className="detail-row" htmlFor="slug-generator-deduplicate">
              <span className="badge">{t("badges.dedupe")}</span>
              <span>{t("deduplicateLabel")}</span>
              <input
                checked={deduplicate}
                id="slug-generator-deduplicate"
                onChange={(event) => {
                  setDeduplicate(event.target.checked);
                  setResult(null);
                }}
                type="checkbox"
              />
            </label>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">
                {result
                  ? t("resultSummary", {
                      count: result.slugCount,
                      duplicates: result.duplicateCount
                    })
                  : t("emptyResult")}
              </p>
            </div>
            <Gauge size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.slugCount ?? 0}</strong>
              <span>{t("slugCountLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.duplicateCount ?? 0}</strong>
              <span>{t("duplicateCountLabel")}</span>
            </article>
          </div>

          <div className="detail-resource-list" style={{ marginTop: 20 }}>
            {result?.rows.length ? (
              result.rows.map((row, index) => (
                <article className="detail-resource-row" key={`${row.source}-${index}`}>
                  <span className="icon-tile green">
                    <Link2 size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{row.slug || t("emptySlug")}</strong>
                    <small>{row.source}</small>
                  </span>
                  {row.duplicateIndex > 0 ? <span className="badge">{t("duplicateBadge", { count: row.duplicateIndex })}</span> : null}
                </article>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyResult")}</p>
            )}
          </div>

          <div className="button-row">
            <button className="button" disabled={!result?.output} onClick={copyOutput} type="button">
              <Copy size={16} aria-hidden="true" /> {t("copyButton")}
            </button>
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("historyTitle")}</h2>
              <p className="tool-description">{t("historyDescription")}</p>
            </div>
            <History size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {history.length ? (
              history.map((entry) => (
                <article className="detail-resource-row" key={entry.slug}>
                  <span className="icon-tile blue">
                    <History size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{entry.slug}</strong>
                    <small>{entry.source}</small>
                  </span>
                </article>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyHistory")}</p>
            )}
          </div>

          <div className="button-row">
            <button className="button" disabled={history.length === 0} onClick={() => setHistory([])} type="button">
              <Trash2 size={16} aria-hidden="true" /> {t("clearHistoryButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.length"), t("reviewItems.duplicates"), t("reviewItems.routing")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("handoffTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
