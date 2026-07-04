"use client";

import { Code2, Grid3X3, Rows3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateGridCss, GRID_PRESETS, type GridOptions } from "@/lib/tools/css-grid-generator";

const defaultOptions = GRID_PRESETS.cards;

export function CssGridGeneratorWorkspace() {
  const t = useTranslations("tools.css-grid-generator.workspace");
  const [options, setOptions] = useState(defaultOptions);
  const [result, setResult] = useState(generateGridCss(defaultOptions));

  const updateOptions = (updates: Partial<GridOptions>) => {
    const nextOptions = { ...options, ...updates };
    setOptions(nextOptions);
    setResult(generateGridCss(nextOptions));
  };

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="css-grid-generator">
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
            <Grid3X3 size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="grid-columns">{t("columnsLabel")}<input className="input" id="grid-columns" max={12} min={1} onChange={(event) => updateOptions({ columns: Number(event.target.value) })} type="number" value={options.columns} /></label>
            <label className="field-label" htmlFor="grid-rows">{t("rowsLabel")}<input className="input" id="grid-rows" max={12} min={1} onChange={(event) => updateOptions({ rows: Number(event.target.value) })} type="number" value={options.rows} /></label>
            <label className="field-label" htmlFor="grid-column-gap">{t("columnGapLabel")}<input className="input" id="grid-column-gap" min={0} onChange={(event) => updateOptions({ columnGap: Number(event.target.value) })} type="number" value={options.columnGap} /></label>
            <label className="field-label" htmlFor="grid-row-gap">{t("rowGapLabel")}<input className="input" id="grid-row-gap" min={0} onChange={(event) => updateOptions({ rowGap: Number(event.target.value) })} type="number" value={options.rowGap} /></label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={() => setResult(generateGridCss(options))} type="button"><Rows3 size={16} aria-hidden="true" /> {t("generateButton")}</button>
          </div>
        </section>
        <section className="workspace-panel">
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: `repeat(${options.columns}, minmax(0, 1fr))` }}>
            {result.previewCells.map((cell) => <div key={cell.id} style={{ background: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: 6, minHeight: 44 }} />)}
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("cssTitle")}</h2><Code2 size={18} aria-hidden="true" /></div>
          <pre aria-label={t("cssOutputLabel")} className="textarea prompt-textarea">{result.css}</pre>
        </section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
