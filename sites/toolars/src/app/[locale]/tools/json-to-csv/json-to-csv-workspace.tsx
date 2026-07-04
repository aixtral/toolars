"use client";

import { ClipboardCheck, ClipboardCopy, FileSpreadsheet, Repeat2, ShieldCheck, Table2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertJsonToCsv, type JsonToCsvResult } from "@/lib/tools/json-to-csv";

const delimiters = [
  { value: ",", labelKey: "comma" },
  { value: ";", labelKey: "semicolon" },
  { value: "\t", labelKey: "tab" }
] as const;

export function JsonToCsvWorkspace() {
  const t = useTranslations("tools.json-to-csv.workspace");
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [result, setResult] = useState<JsonToCsvResult | null>(null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.trim().length > 0;

  const runConversion = () => {
    setCopied(false);
    setResult(convertJsonToCsv({ input, delimiter }));
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
      toolSlug="json-to-csv"
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
            <span className="badge">{t("badges.escape")}</span>
            <span>{t("escapeCopy")}</span>
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

          <label className="field-label" htmlFor="json-to-csv-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="json-to-csv-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={8}
              value={input}
            />
          </label>

          <label className="field-label" htmlFor="json-to-csv-delimiter" style={{ marginTop: 16 }}>
            {t("delimiterLabel")}
            <select
              className="input"
              id="json-to-csv-delimiter"
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
              <p className="tool-description">{result ? getJsonCsvSummary(result, t) : t("emptyResult")}</p>
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
              <strong>{result?.headers.length.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("headersLabel")}</span>
            </article>
          </div>

          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t(`errors.${result.error?.type ?? "conversion-failed"}`)}</span>
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
            {[t("reviewItems.array"), t("reviewItems.headers"), t("reviewItems.nested")].map((item, index) => (
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
            {result && !result.success ? <TriangleAlert size={18} aria-hidden="true" /> : <FileSpreadsheet size={18} aria-hidden="true" />}
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getJsonCsvSummary(result: JsonToCsvResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("convertedSummary", {
    rows: result.stats.rows
  });
}
