"use client";
import { useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateUnitConversion,
  defaultUnitConversionScenario,
  getUnitOptions,
  unitCategoryOptions,
  type UnitCategory,
  type UnitConversionInput,
  type UnitConversionResult
} from "@/lib/tools/unit-converter";

const trustRows = [
  ["Local", "Measurement values stay in this browser session", "local"],
  ["Precision", "Daily-use conversions are not certified calibration", "warn"],
  ["Private", "Save only stores the conversion locally when you choose it", ""]
] as const;

const precisionNotes = [
  "VitalCalc converts non-temperature units through a shared base factor.",
  "Temperature uses a base conversion step because scales have offsets.",
  "Use certified instruments for regulated measurement or lab-grade precision."
];

const defaultUnitByCategory: Record<UnitCategory, { fromUnit: string; toUnit: string }> = {
  length: { fromUnit: "km", toUnit: "mi" },
  weight: { fromUnit: "kg", toUnit: "lb" },
  temperature: { fromUnit: "c", toUnit: "f" },
  area: { fromUnit: "m2", toUnit: "ft2" },
  volume: { fromUnit: "l", toUnit: "gal_us" },
  speed: { fromUnit: "kph", toUnit: "mph" },
  data: { fromUnit: "mb", toUnit: "gb" }
};

export function UnitConverterWorkspace() {
  const t = useTranslations("tools.unit-converter");
  const [plan, setPlan] = useState<UnitConversionInput>(defaultUnitConversionScenario);
  const [result, setResult] = useState<UnitConversionResult | null>(null);
  const unitOptions = getUnitOptions(plan.category);

  const calculate = () => {
    setResult(calculateUnitConversion(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.unit-converter.plan", JSON.stringify(plan));
  };

  const updateNumber = (value: string) => {
    setPlan((current) => ({ ...current, value: Number(value) }));
    setResult(null);
  };

  const updateCategory = (value: string) => {
    const category = value as UnitCategory;
    setPlan((current) => ({
      ...current,
      category,
      fromUnit: defaultUnitByCategory[category].fromUnit,
      toUnit: defaultUnitByCategory[category].toUnit
    }));
    setResult(null);
  };

  const updateUnit = (key: "fromUnit" | "toUnit", value: string) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="unit-converter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc utility workspace</span>
        <h1>Unit Converter</h1>
        <p className="subtitle">Convert everyday length, weight, temperature, area, volume, speed, and data units locally.</p>

        <h2 style={{ marginTop: 28 }}>Local conversion model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/unit-converter/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Conversion inputs</h2>
              <p className="tool-description">Choose a category, source unit, target unit, and value.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="unit-category">
              Category
              <select className="input" id="unit-category" onChange={(event) => updateCategory(event.target.value)} value={plan.category}>
                {unitCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="unit-value">
              Value
              <input className="input" id="unit-value" onChange={(event) => updateNumber(event.target.value)} type="number" value={plan.value} />
            </label>
            <label className="field-label" htmlFor="unit-from">
              From unit
              <select className="input" id="unit-from" onChange={(event) => updateUnit("fromUnit", event.target.value)} value={plan.fromUnit}>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="unit-to">
              To unit
              <select className="input" id="unit-to" onChange={(event) => updateUnit("toUnit", event.target.value)} value={plan.toUnit}>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save conversion
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Convert units
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Converted value</h2>
              <p className="tool-description">{result ? result.summary : "Run conversion to see result and formula context."}</p>
            </div>
            <span className="badge local">{result?.category ?? "Units"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedResult ?? "0"}</strong>
              <span>Converted value</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `Target unit ${result.targetUnitLabel}` : "Target unit"}</strong>
              <span>Target unit</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fromUnitLabel ?? "-"}</strong>
              <span>Source unit</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? "-"}</strong>
              <span>Category</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formulaNote ?? "Waiting for conversion"}</strong>
              <small>{result ? result.quickReferences.map((item) => `${item.unit}: ${item.value}`).join(" / ") : "Convert first to reveal quick reference values."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Precision notes</h2>
        <div className="remediation-list">
          {precisionNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Local-first
          </strong>
          <p>Measurement values are converted locally without a server round trip.</p>
        </div>
      </aside>
    </div>
  );
}
