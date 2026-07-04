"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { planPdfToWordConversion, type PdfToWordFile, type PdfToWordPlanResult } from "@/lib/tools/pdf-to-word";

export function PdfToWordWorkspace() {
  const t = useTranslations("tools.pdf-to-word.workspace");
  const [metadata, setMetadata] = useState("");
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [result, setResult] = useState<PdfToWordPlanResult | null>(null);

  const runPlan = () => {
    setResult(planPdfToWordConversion({ file: parsePdfMetadata(metadata), preserveLayout }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-handoff" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-to-word"
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
          <label className="field-label" htmlFor="pdf-to-word-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="pdf-to-word-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <label className="detail-row" htmlFor="pdf-to-word-preserve" style={{ marginTop: 16 }}>
            <span className="badge">{t("badges.layout")}</span>
            <span>{t("preserveLayoutLabel")}</span>
            <input
              aria-label={t("preserveLayoutLabel")}
              checked={preserveLayout}
              id="pdf-to-word-preserve"
              onChange={(event) => setPreserveLayout(event.target.checked)}
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
              <p className="tool-description">{result?.status === "ready-for-handoff" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-handoff" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-handoff" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
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

function parsePdfMetadata(input: string): PdfToWordFile {
  const [name = "", pages = "1", sizeBytes = "0"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type: "application/pdf"
  };
}
