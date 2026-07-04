"use client";

import { FileStack, ListChecks, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { planPdfMerge, type PdfMergeFile, type PdfMergePlanResult } from "@/lib/tools/pdf-merger";

export function PdfMergerWorkspace() {
  const t = useTranslations("tools.pdf-merger.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PdfMergePlanResult | null>(null);

  const runPlan = () => {
    setResult(planPdfMerge({ files: parsePdfRows(input) }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-merger"
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
            <span className="badge">{t("badges.queue")}</span>
            <span>{t("queueCopy")}</span>
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
            <FileStack size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="pdf-merger-files">
            {t("filesLabel")}
            <textarea
              className="input"
              id="pdf-merger-files"
              onChange={(event) => {
                setInput(event.target.value);
                setResult(null);
              }}
              placeholder={t("filesPlaceholder")}
              rows={7}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runPlan} type="button">
              <ListChecks size={16} aria-hidden="true" /> {t("planButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultTitle")}</h2>
              <p className="tool-description">{result ? getSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
            </span>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.status === "ready"
              ? JSON.stringify(result.output, null, 2)
              : result?.validationIssues.join("\n") || t("emptyOutput")}
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

function parsePdfRows(input: string): PdfMergeFile[] {
  return input
    .split(/\n+/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [name = "", pages = "1", sizeBytes = "0"] = row.split(",").map((part) => part.trim());
      return {
        name,
        pages: Number(pages) || 1,
        sizeBytes: Number(sizeBytes) || 0,
        type: "application/pdf"
      };
    });
}

function getSummary(result: PdfMergePlanResult, t: ReturnType<typeof useTranslations>) {
  if (result.status !== "ready") return t("blockedSummary");
  return t("readySummary", {
    pages: result.output.totalPages,
    size: result.output.estimatedSizeMb
  });
}
