"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  planAiPdfSummary,
  type AiPdfSummaryFile,
  type AiPdfSummaryPlanResult,
  type PdfSummaryStyle
} from "@/lib/tools/ai-pdf-summarizer";

const summaryStyles: PdfSummaryStyle[] = ["executive", "study", "legal-review"];
const defaultSummaryStyle: PdfSummaryStyle = "executive";

export function AiPdfSummarizerWorkspace() {
  const t = useTranslations("tools.ai-pdf-summarizer.workspace");
  const [metadata, setMetadata] = useState("");
  const [summaryStyle, setSummaryStyle] = useState(defaultSummaryStyle);
  const [includeActionItems, setIncludeActionItems] = useState(true);
  const [result, setResult] = useState<AiPdfSummaryPlanResult | null>(null);

  const runPlan = () => {
    const parsed = parsePdfExtractionMetadata(metadata);
    setResult(
      planAiPdfSummary({
        extractedTextChars: parsed.extractedTextChars,
        file: parsed.file,
        includeActionItems,
        summaryStyle
      })
    );
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-ai-consent" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="ai-pdf-summarizer"
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
            <FileText size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="ai-pdf-summarizer-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="ai-pdf-summarizer-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <label className="field-label" htmlFor="ai-pdf-summarizer-style" style={{ marginTop: 16 }}>
            {t("styleLabel")}
            <select className="input" id="ai-pdf-summarizer-style" onChange={(event) => setSummaryStyle(event.target.value as PdfSummaryStyle)} value={summaryStyle}>
              {summaryStyles.map((style) => (
                <option key={style} value={style}>
                  {t(`styles.${style}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="detail-row" htmlFor="ai-pdf-summarizer-actions" style={{ marginTop: 16 }}>
            <span className="badge">{t("badges.local")}</span>
            <span>{t("actionItemsLabel")}</span>
            <input
              aria-label={t("actionItemsLabel")}
              checked={includeActionItems}
              id="ai-pdf-summarizer-actions"
              onChange={(event) => setIncludeActionItems(event.target.checked)}
              type="checkbox"
            />
          </label>
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
              <p className="tool-description">{result?.status === "ready-for-ai-consent" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-ai-consent" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-ai-consent" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
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

function parsePdfExtractionMetadata(input: string): { extractedTextChars: number; file: AiPdfSummaryFile } {
  const [name = "", pages = "1", sizeBytes = "0", extractedTextChars = "0"] = input.split(",").map((part) => part.trim());
  return {
    extractedTextChars: Number(extractedTextChars) || 0,
    file: {
      name,
      pages: Number(pages) || 1,
      sizeBytes: Number(sizeBytes) || 0,
      type: "application/pdf"
    }
  };
}
