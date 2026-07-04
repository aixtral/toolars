"use client";

import { Code2, CornerDownRight, SquareRoundCorner } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateBorderRadiusCSS, type BorderRadiusResult, type RadiusUnit } from "@/lib/tools/css-border-radius-generator";

const initialBorderRadiusResult = null as BorderRadiusResult | null;

export function CssBorderRadiusGeneratorWorkspace() {
  const t = useTranslations("tools.css-border-radius-generator.workspace");
  const [topLeft, setTopLeft] = useState(16);
  const [topRight, setTopRight] = useState(16);
  const [bottomRight, setBottomRight] = useState(16);
  const [bottomLeft, setBottomLeft] = useState(16);
  const [unit, setUnit] = useState("px" as RadiusUnit);
  const [result, setResult] = useState(initialBorderRadiusResult);

  const runGeneration = () => {
    setResult(generateBorderRadiusCSS({ topLeft, topRight, bottomRight, bottomLeft, unit }));
  };

  const previewRadius = result?.preview ?? `${topLeft}${unit}`;

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="css-border-radius-generator"
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
            <SquareRoundCorner size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="radius-top-left">
              {t("topLeftLabel")}
              <input className="input" id="radius-top-left" onChange={(event) => { setTopLeft(Number(event.target.value)); setResult(null); }} type="number" value={topLeft} />
            </label>
            <label className="field-label" htmlFor="radius-top-right">
              {t("topRightLabel")}
              <input className="input" id="radius-top-right" onChange={(event) => { setTopRight(Number(event.target.value)); setResult(null); }} type="number" value={topRight} />
            </label>
            <label className="field-label" htmlFor="radius-bottom-right">
              {t("bottomRightLabel")}
              <input className="input" id="radius-bottom-right" onChange={(event) => { setBottomRight(Number(event.target.value)); setResult(null); }} type="number" value={bottomRight} />
            </label>
            <label className="field-label" htmlFor="radius-bottom-left">
              {t("bottomLeftLabel")}
              <input className="input" id="radius-bottom-left" onChange={(event) => { setBottomLeft(Number(event.target.value)); setResult(null); }} type="number" value={bottomLeft} />
            </label>
            <label className="field-label" htmlFor="radius-unit">
              {t("unitLabel")}
              <select className="input" id="radius-unit" onChange={(event) => { setUnit(event.target.value as RadiusUnit); setResult(null); }} value={unit}>
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={runGeneration} type="button">
              <CornerDownRight size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div
            aria-label={t("previewLabel")}
            style={{
              alignItems: "center",
              background: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: 8,
              display: "flex",
              justifyContent: "center",
              minHeight: 180
            }}
          >
            <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: previewRadius, height: 112, width: 180 }} />
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("cssTitle")}</h2>
              <p className="tool-description">{result ? (result.simplified ? t("simplifiedCopy") : t("expandedCopy")) : t("emptyResult")}</p>
            </div>
            <Code2 size={18} aria-hidden="true" />
          </div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{result?.css ?? t("emptyCss")}</pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <SquareRoundCorner size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.scale"), t("reviewItems.units"), t("reviewItems.preview")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
