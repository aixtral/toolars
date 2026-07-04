"use client";

import { ShieldCheck, Table2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  planTableExtraction,
  type TableExtractionFile,
  type TableExtractionOutputFormat,
  type TableExtractionResult
} from "@/lib/tools/extract-tables";

const formats: TableExtractionOutputFormat[] = ["csv", "xlsx"];
const initialOutputFormat = "csv" as TableExtractionOutputFormat;
const initialExtractionResult = null as TableExtractionResult | null;

export function ExtractTablesWorkspace() {
  const t = useTranslations("tools.extract-tables.workspace");
  const [metadata, setMetadata] = useState("");
  const [pageRange, setPageRange] = useState("1-3");
  const [outputFormat, setOutputFormat] = useState(initialOutputFormat);
  const [result, setResult] = useState(initialExtractionResult);

  const runPlan = () => {
    setResult(planTableExtraction({ file: parsePdfMetadata(metadata), outputFormat, pageRange }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-extractor" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="extract-tables"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
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
          <label className="field-label" htmlFor="extract-tables-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="extract-tables-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="extract-tables-range">
              {t("rangeLabel")}
              <input
                className="input"
                id="extract-tables-range"
                onChange={(event) => {
                  setPageRange(event.target.value);
                  setResult(null);
                }}
                value={pageRange}
              />
            </label>
            <label className="field-label" htmlFor="extract-tables-format">
              {t("formatLabel")}
              <select className="input" id="extract-tables-format" onChange={(event) => setOutputFormat(event.target.value as TableExtractionOutputFormat)} value={outputFormat}>
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {t(`formats.${format}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={runPlan} type="button">
              {t("planButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultTitle")}</h2>
              <p className="tool-description">{result?.status === "ready-for-extractor" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-extractor" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-extractor" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
            </span>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.output ? JSON.stringify(result.output, null, 2) : result?.validationIssues.join("\n") || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("trustTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.trustBoundary.note ?? t("trustCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function parsePdfMetadata(input: string): TableExtractionFile {
  const [name = "", pages = "1", sizeBytes = "0"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type: "application/pdf"
  };
}
