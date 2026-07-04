"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  planPdfPasswordRemoval,
  type PdfPasswordRemovalFile,
  type PdfPasswordRemovalResult
} from "@/lib/tools/pdf-password-remover";

export function PdfPasswordRemoverWorkspace() {
  const t = useTranslations("tools.pdf-password-remover.workspace");
  const [metadata, setMetadata] = useState("");
  const [hasRightsToUnlock, setHasRightsToUnlock] = useState(false);
  const [passwordProvided, setPasswordProvided] = useState(false);
  const [result, setResult] = useState<PdfPasswordRemovalResult | null>(null);

  const runPlan = () => {
    setResult(planPdfPasswordRemoval({ file: parsePdfMetadata(metadata), hasRightsToUnlock, passwordProvided }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-engine" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-password-remover"
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
            <LockKeyhole size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="pdf-password-remover-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="pdf-password-remover-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <label className="detail-row" htmlFor="pdf-password-remover-rights" style={{ marginTop: 16 }}>
            <span className="badge">{t("badges.ownership")}</span>
            <span>{t("ownershipLabel")}</span>
            <input
              aria-label={t("ownershipLabel")}
              checked={hasRightsToUnlock}
              id="pdf-password-remover-rights"
              onChange={(event) => setHasRightsToUnlock(event.target.checked)}
              type="checkbox"
            />
          </label>
          <label className="detail-row" htmlFor="pdf-password-remover-password" style={{ marginTop: 12 }}>
            <span className="badge">{t("badges.password")}</span>
            <span>{t("passwordLabel")}</span>
            <input
              aria-label={t("passwordLabel")}
              checked={passwordProvided}
              id="pdf-password-remover-password"
              onChange={(event) => setPasswordProvided(event.target.checked)}
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
              <p className="tool-description">{result?.status === "ready-for-engine" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-engine" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-engine" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
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

function parsePdfMetadata(input: string): PdfPasswordRemovalFile {
  const [name = "", pages = "1", sizeBytes = "0"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type: "application/pdf"
  };
}
