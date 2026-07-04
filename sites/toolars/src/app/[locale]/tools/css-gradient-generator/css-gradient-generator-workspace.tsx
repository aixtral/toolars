"use client";

import { Code2, Paintbrush, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateGradientCss, type GradientCssResult } from "@/lib/tools/css-gradient-generator";

export function CssGradientGeneratorWorkspace() {
  const t = useTranslations("tools.css-gradient-generator.workspace");
  const [firstColor, setFirstColor] = useState("#0f172a");
  const [secondColor, setSecondColor] = useState("#14b8a6");
  const [angle, setAngle] = useState(135);
  const [result, setResult] = useState<GradientCssResult | null>(null);

  const runGeneration = () => {
    setResult(generateGradientCss({
      type: "linear",
      angle,
      shape: "ellipse",
      stops: [
        { color: firstColor, position: 0 },
        { color: secondColor, position: 100 }
      ]
    }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="css-gradient-generator"
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
            <Paintbrush size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="gradient-first-color">
              {t("firstColorLabel")}
              <input className="input" id="gradient-first-color" onChange={(event) => { setFirstColor(event.target.value); setResult(null); }} value={firstColor} />
            </label>
            <label className="field-label" htmlFor="gradient-second-color">
              {t("secondColorLabel")}
              <input className="input" id="gradient-second-color" onChange={(event) => { setSecondColor(event.target.value); setResult(null); }} value={secondColor} />
            </label>
            <label className="field-label" htmlFor="gradient-angle">
              {t("angleLabel")}
              <input className="input" id="gradient-angle" onChange={(event) => { setAngle(Number(event.target.value)); setResult(null); }} type="number" value={angle} />
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={runGeneration} type="button">
              <Sparkles size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div
            aria-label={t("previewLabel")}
            style={{
              background: result?.preview ?? `linear-gradient(${angle}deg, ${firstColor} 0%, ${secondColor} 100%)`,
              border: "1px solid var(--border)",
              borderRadius: 8,
              minHeight: 160
            }}
          />
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("cssTitle")}</h2>
            <Code2 size={18} aria-hidden="true" />
          </div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{result?.css ?? t("emptyCss")}</pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <Code2 size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.stops"), t("reviewItems.angle"), t("reviewItems.tokens")].map((item, index) => (
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
