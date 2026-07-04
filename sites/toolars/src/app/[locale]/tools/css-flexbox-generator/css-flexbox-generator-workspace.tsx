"use client";

import { AlignCenter, Code2, LayoutPanelLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { FLEXBOX_PRESETS, generateFlexboxCss, type FlexboxOptions } from "@/lib/tools/css-flexbox-generator";

const defaultOptions = FLEXBOX_PRESETS.centered;

export function CssFlexboxGeneratorWorkspace() {
  const t = useTranslations("tools.css-flexbox-generator.workspace");
  const [options, setOptions] = useState(defaultOptions);
  const [result, setResult] = useState(generateFlexboxCss(defaultOptions));

  const updateOptions = (updates: Partial<FlexboxOptions>) => {
    const nextOptions = { ...options, ...updates };
    setOptions(nextOptions);
    setResult(generateFlexboxCss(nextOptions));
  };

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="css-flexbox-generator">
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
            <LayoutPanelLeft size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="flex-direction">
              {t("directionLabel")}
              <select className="input" id="flex-direction" onChange={(event) => updateOptions({ direction: event.target.value as FlexboxOptions["direction"] })} value={options.direction}>
                <option value="row">{t("directions.row")}</option>
                <option value="column">{t("directions.column")}</option>
                <option value="row-reverse">{t("directions.rowReverse")}</option>
                <option value="column-reverse">{t("directions.columnReverse")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="flex-justify">
              {t("justifyLabel")}
              <select className="input" id="flex-justify" onChange={(event) => updateOptions({ justify: event.target.value as FlexboxOptions["justify"] })} value={options.justify}>
                <option value="center">{t("justify.center")}</option>
                <option value="flex-start">{t("justify.start")}</option>
                <option value="flex-end">{t("justify.end")}</option>
                <option value="space-between">{t("justify.between")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="flex-gap">
              {t("gapLabel")}
              <input className="input" id="flex-gap" min={0} onChange={(event) => updateOptions({ gap: Number(event.target.value) })} type="number" value={options.gap} />
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={() => setResult(generateFlexboxCss(options))} type="button">
              <AlignCenter size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("previewTitle")}</h2>
            <AlignCenter size={18} aria-hidden="true" />
          </div>
          <div style={{ alignItems: result.previewStyle.alignItems, border: "1px solid var(--border)", borderRadius: 8, display: "flex", flexDirection: result.previewStyle.flexDirection, flexWrap: result.previewStyle.flexWrap, gap: result.previewStyle.gap, justifyContent: result.previewStyle.justifyContent, minHeight: 150, padding: 16 }}>
            {[1, 2, 3].map((item) => <div key={item} style={{ background: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: 8, minHeight: 48, padding: 16 }}>{t("previewItem", { item })}</div>)}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("cssTitle")}</h2>
            <Code2 size={18} aria-hidden="true" />
          </div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{`${result.containerCss}\n\n.item {\n  ${result.itemCss}\n}`}</pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("reviewTitle")}</h2>
          <p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
