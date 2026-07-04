"use client";

import { BoxSelect, Code2, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { BOX_SHADOW_PRESETS, generateBoxShadowCss, type BoxShadowCssResult, type ShadowLayer } from "@/lib/tools/css-box-shadow-generator";

const defaultLayer: ShadowLayer = { x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 15, inset: false };

export function CssBoxShadowGeneratorWorkspace() {
  const t = useTranslations("tools.css-box-shadow-generator.workspace");
  const [layers, setLayers] = useState([defaultLayer]);
  const [result, setResult] = useState(generateBoxShadowCss([defaultLayer]));

  const updateLayer = (updates: Partial<ShadowLayer>) => {
    const nextLayers = [{ ...layers[0], ...updates }];
    setLayers(nextLayers);
    setResult(generateBoxShadowCss(nextLayers));
  };

  const applyPreset = (presetKey: keyof typeof BOX_SHADOW_PRESETS) => {
    const nextLayers = BOX_SHADOW_PRESETS[presetKey].layers;
    setLayers(nextLayers);
    setResult(generateBoxShadowCss(nextLayers));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={t("artifact.ready")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="css-box-shadow-generator"
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
            <BoxSelect size={18} aria-hidden="true" />
          </div>
          <div className="button-row">
            {Object.entries(BOX_SHADOW_PRESETS).map(([key, preset]) => (
              <button className="button" key={key} onClick={() => applyPreset(key as keyof typeof BOX_SHADOW_PRESETS)} type="button">
                {preset.name}
              </button>
            ))}
          </div>
          <div className="llm-input-grid" style={{ marginTop: 20 }}>
            <label className="field-label" htmlFor="shadow-x">
              {t("xOffsetLabel")}
              <input className="input" id="shadow-x" onChange={(event) => updateLayer({ x: Number(event.target.value) })} type="number" value={layers[0]?.x ?? 0} />
            </label>
            <label className="field-label" htmlFor="shadow-y">
              {t("yOffsetLabel")}
              <input className="input" id="shadow-y" onChange={(event) => updateLayer({ y: Number(event.target.value) })} type="number" value={layers[0]?.y ?? 0} />
            </label>
            <label className="field-label" htmlFor="shadow-blur">
              {t("blurLabel")}
              <input className="input" id="shadow-blur" onChange={(event) => updateLayer({ blur: Number(event.target.value) })} type="number" value={layers[0]?.blur ?? 0} />
            </label>
            <label className="field-label" htmlFor="shadow-spread">
              {t("spreadLabel")}
              <input className="input" id="shadow-spread" onChange={(event) => updateLayer({ spread: Number(event.target.value) })} type="number" value={layers[0]?.spread ?? 0} />
            </label>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("previewTitle")}</h2>
              <p className="tool-description">{t("layerCount", { count: result.layerCount })}</p>
            </div>
            <Layers size={18} aria-hidden="true" />
          </div>
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
            <div style={{ background: "#ffffff", borderRadius: 12, boxShadow: result.preview, height: 96, width: 160 }} />
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("cssTitle")}</h2>
            <Code2 size={18} aria-hidden="true" />
          </div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{result.css}</pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <Layers size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.subtle"), t("reviewItems.layers"), t("reviewItems.tokens")].map((item, index) => (
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
