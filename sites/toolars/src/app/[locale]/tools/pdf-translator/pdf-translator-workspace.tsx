"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  planPdfTranslation,
  type PdfTranslationFile,
  type PdfTranslationLanguage,
  type PdfTranslationPlanResult
} from "@/lib/tools/pdf-translator";

const languages: PdfTranslationLanguage[] = ["en", "es", "fr", "ja", "zh-hans", "zh-hant"];
const defaultSourceLanguage: PdfTranslationLanguage = "en";
const defaultTargetLanguage: PdfTranslationLanguage = "es";

export function PdfTranslatorWorkspace() {
  const t = useTranslations("tools.pdf-translator.workspace");
  const [metadata, setMetadata] = useState("");
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [result, setResult] = useState(null as PdfTranslationPlanResult | null);
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);

  const runPlan = () => {
    const parsed = parsePdfExtractionMetadata(metadata);
    setResult(
      planPdfTranslation({
        extractedTextChars: parsed.extractedTextChars,
        file: parsed.file,
        preserveLayout,
        sourceLanguage,
        targetLanguage
      })
    );
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-ai-consent" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pdf-translator"
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
          <label className="field-label" htmlFor="pdf-translator-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="pdf-translator-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="pdf-translator-source">
              {t("sourceLanguageLabel")}
              <select className="input" id="pdf-translator-source" onChange={(event) => setSourceLanguage(event.target.value as PdfTranslationLanguage)} value={sourceLanguage}>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {t(`languages.${language}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="pdf-translator-target">
              {t("targetLanguageLabel")}
              <select className="input" id="pdf-translator-target" onChange={(event) => setTargetLanguage(event.target.value as PdfTranslationLanguage)} value={targetLanguage}>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {t(`languages.${language}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="detail-row" htmlFor="pdf-translator-layout" style={{ marginTop: 16 }}>
            <span className="badge">{t("badges.layout")}</span>
            <span>{t("preserveLayoutLabel")}</span>
            <input
              aria-label={t("preserveLayoutLabel")}
              checked={preserveLayout}
              id="pdf-translator-layout"
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

function parsePdfExtractionMetadata(input: string): { extractedTextChars: number; file: PdfTranslationFile } {
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
