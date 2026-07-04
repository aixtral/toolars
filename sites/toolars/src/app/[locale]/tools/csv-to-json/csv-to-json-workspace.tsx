"use client";

import { ClipboardCheck, ClipboardCopy, FileJson2, Repeat2, ShieldCheck, Table2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertCsvToJson, type CsvToJsonResult } from "@/lib/tools/csv-to-json";

const delimiters = [
  { value: ",", labelKey: "comma" },
  { value: ";", labelKey: "semicolon" },
  { value: "\t", labelKey: "tab" }
] as const;

export function CsvToJsonWorkspace() {
  const t = useTranslations("tools.csv-to-json.workspace");
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [skipEmptyRows, setSkipEmptyRows] = useState(true);
  const [result, setResult] = useState<CsvToJsonResult | null>(null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.trim().length > 0;

  const runConversion = () => {
    setCopied(false);
    setResult(convertCsvToJson({ input, delimiter, hasHeaders, skipEmptyRows }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
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
      toolSlug="csv-to-json"
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
            <span className="badge">{t("badges.quoted")}</span>
            <span>{t("quotedCopy")}</span>
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
            <Table2 size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="csv-to-json-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="csv-to-json-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={8}
              value={input}
            />
          </label>

          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="csv-to-json-delimiter">
              {t("delimiterLabel")}
              <select
                className="input"
                id="csv-to-json-delimiter"
                onChange={(event) => {
                  setDelimiter(event.target.value);
                  setResult(null);
                  setCopied(false);
                }}
                value={delimiter}
              >
                {delimiters.map((item) => (
                  <option key={item.labelKey} value={item.value}>
                    {t(`delimiters.${item.labelKey}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="detail-row-list" style={{ marginTop: 18 }}>
            <label className="detail-row" htmlFor="csv-to-json-headers">
              <span className="badge">{t("badges.headers")}</span>
              <span>{t("headersLabel")}</span>
              <input
                aria-label={t("headersLabel")}
                checked={hasHeaders}
                id="csv-to-json-headers"
                onChange={(event) => {
                  setHasHeaders(event.target.checked);
                  setResult(null);
                  setCopied(false);
                }}
                type="checkbox"
              />
            </label>
            <label className="detail-row" htmlFor="csv-to-json-skip-empty">
              <span className="badge">{t("badges.emptyRows")}</span>
              <span>{t("skipEmptyLabel")}</span>
              <input
                aria-label={t("skipEmptyLabel")}
                checked={skipEmptyRows}
                id="csv-to-json-skip-empty"
                onChange={(event) => {
                  setSkipEmptyRows(event.target.checked);
                  setResult(null);
                  setCopied(false);
                }}
                type="checkbox"
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runConversion} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getCsvSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.ready") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.rows.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("rowsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.columns.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("columnsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.skippedEmptyRows.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("skippedLabel")}</span>
            </article>
          </div>

          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t(`errors.${result.error?.type ?? "parse-failed"}`)}</span>
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
            {[t("reviewItems.columns"), t("reviewItems.headers"), t("reviewItems.copy")].map((item, index) => (
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
            {result && !result.success ? <TriangleAlert size={18} aria-hidden="true" /> : <FileJson2 size={18} aria-hidden="true" />}
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getCsvSummary(result: CsvToJsonResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("convertedSummary", {
    rows: result.stats.rows
  });
}
