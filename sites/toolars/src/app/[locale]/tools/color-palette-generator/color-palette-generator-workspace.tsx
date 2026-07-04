"use client";

import { ClipboardList, Palette, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { exportAsCssVariables, generatePalette, type HarmonyType, type Palette as GeneratedPalette } from "@/lib/tools/color-palette-generator";

const harmonyOptions: HarmonyType[] = ["complementary", "analogous", "triadic", "split-complementary", "tetradic", "monochromatic"];

export function ColorPaletteGeneratorWorkspace() {
  const t = useTranslations("tools.color-palette-generator.workspace");
  const [baseColor, setBaseColor] = useState("#3366ff");
  const [harmony, setHarmony] = useState((): HarmonyType => "complementary");
  const [palette, setPalette] = useState((): GeneratedPalette | null => null);

  const runGeneration = () => {
    setPalette(generatePalette(baseColor, harmony, 2, 2));
  };

  const cssOutput = palette ? exportAsCssVariables(palette) : t("emptyCss");

  return (
    <AiLabWorkbenchShell
      artifactState={palette ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="color-palette-generator"
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
            <Palette size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="palette-base-color">
              {t("baseColorLabel")}
              <input className="input" id="palette-base-color" onChange={(event) => { setBaseColor(event.target.value); setPalette(null); }} value={baseColor} />
            </label>
            <label className="field-label" htmlFor="palette-harmony">
              {t("harmonyLabel")}
              <select className="input" id="palette-harmony" onChange={(event) => { setHarmony(event.target.value as HarmonyType); setPalette(null); }} value={harmony}>
                {harmonyOptions.map((option) => (
                  <option key={option} value={option}>{t(`harmonies.${option}`)}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={runGeneration} type="button">
              <Sparkles size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{palette ? t("resultSummary", { count: palette.colors.length }) : t("emptyResult")}</p>
            </div>
            <span className={palette ? "badge local" : "badge"}>{palette ? t("badges.ready") : t("badges.waiting")}</span>
          </div>
          <div className="detail-resource-list">
            {palette?.colors.map((color, index) => (
              <article className="detail-resource-row" key={`${color.hex}-${index}`}>
                <span className="icon-tile blue" style={{ background: color.hex }} />
                <span>
                  <strong>{color.hex}</strong>
                  <small>{`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}</small>
                </span>
              </article>
            )) ?? <p className="detail-aside-note">{t("emptySwatches")}</p>}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("cssTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{cssOutput}</pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.contrast"), t("reviewItems.tokens"), t("reviewItems.export")].map((item, index) => (
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
