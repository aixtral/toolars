"use client";

import { ArrowRightLeft, Code2, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertCssUnit, DEFAULT_CSS_UNIT_CONTEXT, type CssUnit } from "@/lib/tools/css-unit-converter";

const units: CssUnit[] = ["px", "rem", "em", "%", "vw", "vh", "cm", "mm", "in", "pt", "pc"];

export function CssUnitConverterWorkspace() {
  const t = useTranslations("tools.css-unit-converter.workspace");
  const [value, setValue] = useState(32);
  const [fromUnit, setFromUnit] = useState("px" as CssUnit);
  const [toUnit, setToUnit] = useState("rem" as CssUnit);
  const [result, setResult] = useState(convertCssUnit({ value, fromUnit, toUnit, context: DEFAULT_CSS_UNIT_CONTEXT }));

  const runConversion = () => setResult(convertCssUnit({ value, fromUnit, toUnit, context: DEFAULT_CSS_UNIT_CONTEXT }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="css-unit-converter">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Ruler size={18} aria-hidden="true" /></div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="unit-value">{t("valueLabel")}<input className="input" id="unit-value" onChange={(event) => setValue(Number(event.target.value))} type="number" value={value} /></label>
            <label className="field-label" htmlFor="from-unit">{t("fromUnitLabel")}<select className="input" id="from-unit" onChange={(event) => setFromUnit(event.target.value as CssUnit)} value={fromUnit}>{units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></label>
            <label className="field-label" htmlFor="to-unit">{t("toUnitLabel")}<select className="input" id="to-unit" onChange={(event) => setToUnit(event.target.value as CssUnit)} value={toUnit}>{units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></label>
          </div>
          <div className="button-row"><button className="button button-solid" onClick={runConversion} type="button"><ArrowRightLeft size={16} aria-hidden="true" /> {t("convertButton")}</button></div>
        </section>
        <section className="workspace-panel"><h2>{t("resultTitle")}</h2><strong aria-label={t("outputLabel")} style={{ display: "block", fontSize: 32 }}>{result.cssValue}</strong><p className="tool-description">{result.formula}</p></section>
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("cssTitle")}</h2><Code2 size={18} aria-hidden="true" /></div><pre className="textarea prompt-textarea">{`width: ${result.cssValue};`}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
