"use client";

import { ScanBarcode, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateBarcodeSvg, type BarcodeFormat, type BarcodeSvgResult } from "@/lib/tools/barcode-generator";

const formats: BarcodeFormat[] = ["CODE39", "CODE128", "EAN13", "UPC"];
const defaultFormat: BarcodeFormat = "CODE39";

export function BarcodeGeneratorWorkspace() {
  const t = useTranslations("tools.barcode-generator.workspace");
  const [value, setValue] = useState("");
  const [format, setFormat] = useState(defaultFormat);
  const [result, setResult] = useState<BarcodeSvgResult | null>(null);

  const runGenerate = () => {
    setResult(generateBarcodeSvg({ format, height: 80, value, width: 2 }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="barcode-generator"
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
            <ScanBarcode size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="barcode-value">
            {t("valueLabel")}
            <input
              className="input"
              id="barcode-value"
              onChange={(event) => {
                setValue(event.target.value);
                setResult(null);
              }}
              placeholder={t("valuePlaceholder")}
              value={value}
            />
          </label>
          <label className="field-label" htmlFor="barcode-format" style={{ marginTop: 16 }}>
            {t("formatLabel")}
            <select className="input" id="barcode-format" onChange={(event) => setFormat(event.target.value as BarcodeFormat)} value={format}>
              {formats.map((item) => (
                <option key={item} value={item}>
                  {t(`formats.${item}`)}
                </option>
              ))}
            </select>
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runGenerate} type="button">
              {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultTitle")}</h2>
              <p className="tool-description">{result?.status === "ready" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
            </span>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.status === "ready" ? result.output.svg : result?.validationIssues.join("\n") || t("emptyOutput")}
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
