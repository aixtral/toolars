"use client";

import { ClipboardCheck, ClipboardCopy, GitCompareArrows, ListTree, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { compareJsonPayloads, type JsonDiffResult } from "@/lib/tools/json-diff";

export function JsonDiffWorkspace() {
  const t = useTranslations("tools.json-diff.workspace");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [result, setResult] = useState<JsonDiffResult | null>(null);
  const [copied, setCopied] = useState(false);
  const canCompare = original.trim().length > 0 && modified.trim().length > 0;

  const updateOriginal = (value: string) => {
    setOriginal(value);
    setResult(null);
    setCopied(false);
  };

  const updateModified = (value: string) => {
    setModified(value);
    setResult(null);
    setCopied(false);
  };

  const comparePayloads = () => {
    setCopied(false);
    setResult(compareJsonPayloads({ original, modified }));
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
      toolSlug="json-diff"
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
            <span className="badge">{t("badges.paths")}</span>
            <span>{t("pathCopy")}</span>
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
            <GitCompareArrows size={18} aria-hidden="true" />
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="json-diff-original">
              {t("originalLabel")}
              <textarea
                className="input"
                id="json-diff-original"
                onChange={(event) => updateOriginal(event.target.value)}
                placeholder={t("originalPlaceholder")}
                rows={8}
                value={original}
              />
            </label>
            <label className="field-label" htmlFor="json-diff-modified">
              {t("modifiedLabel")}
              <textarea
                className="input"
                id="json-diff-modified"
                onChange={(event) => updateModified(event.target.value)}
                placeholder={t("modifiedPlaceholder")}
                rows={8}
                value={modified}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!canCompare} onClick={comparePayloads} type="button">
              <GitCompareArrows size={16} aria-hidden="true" /> {t("compareButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getJsonDiffSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.ready") : result ? t("badges.error") : t("badges.waiting")}
            </span>
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
              <strong>{result?.stats.changed.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("changedLabel")}</span>
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
            {[t("reviewItems.parse"), t("reviewItems.paths"), t("reviewItems.secrets")].map((item, index) => (
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
            <ListTree size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getJsonDiffSummary(result: JsonDiffResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t(`errors.${result.error?.type ?? "comparison-failed"}`);
  return result.summary;
}
