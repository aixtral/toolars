"use client";

import { Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  estimatePdfCompression,
  type PdfCompressionFile,
  type PdfCompressionProfile,
  type PdfCompressionResult
} from "@/lib/tools/pdf-compressor";

const profiles: PdfCompressionProfile[] = ["screen", "balanced", "print"];

export function PdfCompressorWorkspace() {
  const t = useTranslations("tools.pdf-compressor.workspace");
  const [metadata, setMetadata] = useState("");
  const [profile, setProfile] = useState("balanced" as PdfCompressionProfile);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [result, setResult] = useState(null as PdfCompressionResult | null);

  const runEstimate = () => {
    setResult(estimatePdfCompression({ file: parsePdfMetadata(metadata), profile, removeMetadata }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-compressor"
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
            <Gauge size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="pdf-compressor-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="pdf-compressor-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <label className="field-label" htmlFor="pdf-compressor-profile" style={{ marginTop: 16 }}>
            {t("profileLabel")}
            <select className="input" id="pdf-compressor-profile" onChange={(event) => setProfile(event.target.value as PdfCompressionProfile)} value={profile}>
              {profiles.map((item) => (
                <option key={item} value={item}>
                  {t(`profiles.${item}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="detail-row" htmlFor="pdf-compressor-remove-metadata" style={{ marginTop: 16 }}>
            <span className="badge">{t("badges.metadata")}</span>
            <span>{t("removeMetadataLabel")}</span>
            <input
              aria-label={t("removeMetadataLabel")}
              checked={removeMetadata}
              id="pdf-compressor-remove-metadata"
              onChange={(event) => setRemoveMetadata(event.target.checked)}
              type="checkbox"
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runEstimate} type="button">
              {t("estimateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultTitle")}</h2>
              <p className="tool-description">{result?.status === "ready" ? t("readySummary", { savings: result.output.savingsPercent }) : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
            </span>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.status === "ready" ? JSON.stringify(result.output, null, 2) : result?.validationIssues.join("\n") || t("emptyOutput")}
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

function parsePdfMetadata(input: string): PdfCompressionFile {
  const [name = "", pages = "1", sizeBytes = "0"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type: "application/pdf"
  };
}
