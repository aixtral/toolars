"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertTimestamp, getCurrentTimestamp, type TimestampResult } from "@/lib/tools/timestamp-converter";

export function TimestampConverterWorkspace() {
  const t = useTranslations("tools.timestamp-converter.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runConversion = () => {
    setCopied(false);
    setResult(convertTimestamp(input));
  };

  const useNow = () => {
    setCopied(false);
    const current = getCurrentTimestamp();
    setInput(String(current.timestamp));
    setResult(current);
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result?.success || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText([result.iso, result.utc, String(result.timestamp)].join("\n"));
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="timestamp-converter"
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
            <span className="badge">{t("badges.precision")}</span>
            <span>{t("precisionCopy")}</span>
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
          <label className="field-label" htmlFor="timestamp-input">
            {t("inputLabel")}
            <input
              className="input"
              id="timestamp-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={runConversion} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
            <button className="button button-secondary" onClick={useNow} type="button">
              {t("nowButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getTimestampSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.converted") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.success ? String(result.timestamp) : "0"}</strong>
              <span>{t("unixLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.success ? t(`precisions.${result.precision}`) : "-"}</strong>
              <span>{t("precisionLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.success ? result.relative : "-"}</strong>
              <span>{t("relativeLabel")}</span>
            </article>
          </div>
          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t("errors.invalid-timestamp")}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("outputTitle")}</h2>
              <p className="tool-description">{t("outputDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.success} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            {result?.success ? (
              [
                [t("fields.iso"), result.iso],
                [t("fields.utc"), result.utc],
                [t("fields.local"), result.local]
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span className="badge">{label}</span>
                  <span>{value}</span>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyOutput")}</p>
            )}
          </div>
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
            {[t("reviewItems.precision"), t("reviewItems.timezone"), t("reviewItems.copy")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("validationTitle")}</h2>
            <TriangleAlert size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getTimestampSummary(result: TimestampResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("convertedSummary", {
    timestamp: result.timestamp,
    precision: t(`precisions.${result.precision}`)
  });
}
