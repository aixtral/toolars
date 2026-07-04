"use client";

import { ScanText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { planOcrScan, type OcrFile, type OcrLanguage, type OcrOutputFormat, type OcrPlanResult } from "@/lib/tools/ocr-scanner";

const languages: OcrLanguage[] = ["en", "es", "zh-hans", "zh-hant"];
const formats: OcrOutputFormat[] = ["txt", "json"];
const initialLanguage: OcrLanguage = "en";
const initialOutputFormat: OcrOutputFormat = "txt";

export function OcrScannerWorkspace() {
  const t = useTranslations("tools.ocr-scanner.workspace");
  const [metadata, setMetadata] = useState("");
  const [language, setLanguage] = useState(initialLanguage);
  const [outputFormat, setOutputFormat] = useState(initialOutputFormat);
  const [result, setResult] = useState(null as OcrPlanResult | null);

  const runPlan = () => {
    setResult(planOcrScan({ file: parseOcrMetadata(metadata), language, outputFormat }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready-for-ocr" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="ocr-scanner"
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
            <ScanText size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="ocr-scanner-metadata">
            {t("metadataLabel")}
            <input
              className="input"
              id="ocr-scanner-metadata"
              onChange={(event) => {
                setMetadata(event.target.value);
                setResult(null);
              }}
              placeholder={t("metadataPlaceholder")}
              value={metadata}
            />
          </label>
          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="ocr-scanner-language">
              {t("languageLabel")}
              <select className="input" id="ocr-scanner-language" onChange={(event) => setLanguage(event.target.value as OcrLanguage)} value={language}>
                {languages.map((item) => (
                  <option key={item} value={item}>
                    {t(`languages.${item}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="ocr-scanner-format">
              {t("formatLabel")}
              <select className="input" id="ocr-scanner-format" onChange={(event) => setOutputFormat(event.target.value as OcrOutputFormat)} value={outputFormat}>
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
              <p className="tool-description">{result?.status === "ready-for-ocr" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready-for-ocr" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready-for-ocr" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
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

function parseOcrMetadata(input: string): OcrFile {
  const [name = "", type = "application/pdf", sizeBytes = "0", pages = "1"] = input.split(",").map((part) => part.trim());
  return {
    name,
    pages: Number(pages) || 1,
    sizeBytes: Number(sizeBytes) || 0,
    type
  };
}
