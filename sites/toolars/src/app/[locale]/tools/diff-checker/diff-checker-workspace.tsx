"use client";

import { ClipboardCheck, ClipboardCopy, GitCompare, ListMinus, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { compareTextVersions, type DiffCheckerResult } from "@/lib/tools/diff-checker";

export function DiffCheckerWorkspace() {
  const t = useTranslations("tools.diff-checker.workspace");
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");
  const [result, setResult] = useState<DiffCheckerResult | null>(null);
  const [copied, setCopied] = useState(false);
  const canCompare = original.length > 0 || revised.length > 0;

  const updateOriginal = (value: string) => {
    setOriginal(value);
    setResult(null);
    setCopied(false);
  };

  const updateRevised = (value: string) => {
    setRevised(value);
    setResult(null);
    setCopied(false);
  };

  const compareText = () => {
    setCopied(false);
    setResult(compareTextVersions({ original, revised }));
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
      toolSlug="diff-checker"
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
            <span className="badge">{t("badges.lines")}</span>
            <span>{t("lineCopy")}</span>
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
            <label className="field-label" htmlFor="diff-checker-original">
              {t("originalLabel")}
              <textarea
                className="input"
                id="diff-checker-original"
                onChange={(event) => updateOriginal(event.target.value)}
                placeholder={t("originalPlaceholder")}
                rows={8}
                value={original}
              />
            </label>
            <label className="field-label" htmlFor="diff-checker-revised">
              {t("revisedLabel")}
              <textarea
                className="input"
                id="diff-checker-revised"
                onChange={(event) => updateRevised(event.target.value)}
                placeholder={t("revisedPlaceholder")}
                rows={8}
                value={revised}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!canCompare} onClick={compareText} type="button">
              <GitCompare size={16} aria-hidden="true" /> {t("compareButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <ListMinus size={18} aria-hidden="true" />
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
            {[t("reviewItems.context"), t("reviewItems.large"), t("reviewItems.copy")].map((item, index) => (
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
