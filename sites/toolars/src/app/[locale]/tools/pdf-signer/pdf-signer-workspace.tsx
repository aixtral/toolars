"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { planPdfSignature, type PdfSignatureFile, type PdfSignatureIntent, type PdfSignaturePlanResult } from "@/lib/tools/pdf-signer";

const signatureIntents: PdfSignatureIntent[] = ["typed", "drawn", "certificate"];

export function PdfSignerWorkspace() {
  const t = useTranslations("tools.pdf-signer.workspace");
  const [metadata, setMetadata] = useState("");
  const [page, setPage] = useState("1");
  const [signatureIntent, setSignatureIntent] = useState(signatureIntents[0] ?? "typed");
  const [signerName, setSignerName] = useState("");
  const [result, setResult] = useState(null as PdfSignaturePlanResult | null);

  const runPlan = () => {
    setResult(
      planPdfSignature({
        file: parsePdfMetadata(metadata),
        page: Number(page) || 1,
        signatureIntent,
        signerName
      })
    );
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-signing-engine" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-signer"
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
          <label className="field-label" htmlFor="pdf-signer-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="pdf-signer-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <label className="field-label" htmlFor="pdf-signer-name" style={{ marginTop: 16 }}>
            {t("signerLabel")}
            <input
              className="input"
              id="pdf-signer-name"
              onChange={(event) => {
                setSignerName(event.target.value);
                setResult(null);
              }}
              placeholder={t("signerPlaceholder")}
              value={signerName}
            />
          </label>
          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="pdf-signer-page">
              {t("pageLabel")}
              <input className="input" id="pdf-signer-page" min={1} onChange={(event) => setPage(event.target.value)} type="number" value={page} />
            </label>
            <label className="field-label" htmlFor="pdf-signer-intent">
              {t("intentLabel")}
              <select className="input" id="pdf-signer-intent" onChange={(event) => setSignatureIntent(event.target.value as PdfSignatureIntent)} value={signatureIntent}>
                {signatureIntents.map((intent) => (
                  <option key={intent} value={intent}>
                    {t(`intents.${intent}`)}
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
              <p className="tool-description">{result?.status === "ready-for-signing-engine" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-signing-engine" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-signing-engine" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
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

function parsePdfMetadata(input: string): PdfSignatureFile {
  const [name = "", pages = "1", sizeBytes = "0"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type: "application/pdf"
  };
}
