"use client";

import { ClipboardCheck, ClipboardCopy, GitCompare, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { compareTextWithOptions, type TextDiffResult } from "@/lib/tools/text-diff";

export function TextDiffWorkspace() {
  const t = useTranslations("tools.text-diff.workspace");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimLines, setTrimLines] = useState(false);
  const [result, setResult] = useState<TextDiffResult | null>(null);
  const [copied, setCopied] = useState(false);
  const canCompare = original.length > 0 || modified.length > 0;

  const clearResult = () => {
    setResult(null);
    setCopied(false);
  };

  const compareText = () => {
    setCopied(false);
    setResult(
      compareTextWithOptions({
        original,
        revised: modified,
        options: { ignoreWhitespace, ignoreCase, trimLines }
      })
    );
  };

  const copyOutput = async () => {
    if (!result?.output || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="text-diff"
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
            <span className="badge">{t("badges.options")}</span>
            <span>{t("optionsCopy")}</span>
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
            <GitCompare size={18} aria-hidden="true" />
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="text-diff-original">
              {t("originalLabel")}
              <textarea
                className="input"
                id="text-diff-original"
                onChange={(event) => {
                  setOriginal(event.target.value);
                  clearResult();
                }}
                placeholder={t("originalPlaceholder")}
                rows={8}
                value={original}
              />
            </label>
            <label className="field-label" htmlFor="text-diff-modified">
              {t("modifiedLabel")}
              <textarea
                className="input"
                id="text-diff-modified"
                onChange={(event) => {
                  setModified(event.target.value);
                  clearResult();
                }}
                placeholder={t("modifiedPlaceholder")}
                rows={8}
                value={modified}
              />
            </label>
          </div>

          <div className="detail-row-list" style={{ marginTop: 18 }}>
            <label className="detail-row" htmlFor="text-diff-ignore-case">
              <span className="badge">{t("badges.option")}</span>
              <span>{t("ignoreCaseLabel")}</span>
              <input
                aria-label={t("ignoreCaseLabel")}
                checked={ignoreCase}
                id="text-diff-ignore-case"
                onChange={(event) => {
                  setIgnoreCase(event.target.checked);
                  clearResult();
                }}
                type="checkbox"
              />
            </label>
            <label className="detail-row" htmlFor="text-diff-trim-lines">
              <span className="badge">{t("badges.option")}</span>
              <span>{t("trimLinesLabel")}</span>
              <input
                aria-label={t("trimLinesLabel")}
                checked={trimLines}
                id="text-diff-trim-lines"
                onChange={(event) => {
                  setTrimLines(event.target.checked);
                  clearResult();
                }}
                type="checkbox"
              />
            </label>
            <label className="detail-row" htmlFor="text-diff-ignore-whitespace">
              <span className="badge">{t("badges.option")}</span>
              <span>{t("ignoreWhitespaceLabel")}</span>
              <input
                aria-label={t("ignoreWhitespaceLabel")}
                checked={ignoreWhitespace}
                id="text-diff-ignore-whitespace"
                onChange={(event) => {
                  setIgnoreWhitespace(event.target.checked);
                  clearResult();
                }}
                type="checkbox"
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!canCompare} onClick={compareText} type="button">
              <SlidersHorizontal size={16} aria-hidden="true" /> {t("compareButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <SlidersHorizontal size={18} aria-hidden="true" />
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.added.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("addedLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.removed.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("removedLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.unchanged.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("unchangedLabel")}</span>
            </article>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("outputTitle")}</h2>
              <p className="tool-description">{t("outputDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.output} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.output || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.options"), t("reviewItems.exact"), t("reviewItems.copy")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
