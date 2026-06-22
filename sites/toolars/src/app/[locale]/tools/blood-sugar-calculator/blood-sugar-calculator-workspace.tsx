"use client";

import { Calculator, Droplet, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateBloodSugar,
  defaultBloodSugarScenario,
  type BloodSugarInput,
  type BloodSugarInputMode,
  type BloodSugarResult,
  type GlucoseUnit
} from "@/lib/tools/blood-sugar-calculator";

const trustRows = [
  ["Local", "Glucose and A1C values stay in this browser session", "local"],
  ["Reference", "Risk bands are informational and not a diagnosis", "warn"],
  ["Private", "Save only stores the local lab-value sample when you choose it", ""]
] as const;

const sugarNotes = [
  "VitalCalc converts A1C and estimated average glucose with eAG mg/dL = A1C x 28.7 - 46.7.",
  "WHO/ADA reference bands depend on repeat testing, symptoms, and clinician interpretation.",
  "Do not use this workspace to adjust medication or delay professional care."
];

export function BloodSugarCalculatorWorkspace() {
  const [values, setValues] = useState<BloodSugarInput>(() => defaultBloodSugarScenario);
  const [result, setResult] = useState<BloodSugarResult | null>(null);

  const calculate = () => {
    setResult(calculateBloodSugar(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem("toolars.blood-sugar-calculator.values", JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<BloodSugarInput, "fastingGlucose" | "a1c" | "averageGlucose">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: BloodSugarInputMode) => {
    setValues((current) => ({ ...current, inputMode: value }));
    setResult(null);
  };

  const updateUnit = (key: "fastingGlucoseUnit" | "averageGlucoseUnit", value: GlucoseUnit) => {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="blood-sugar-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc lab reference workspace</span>
        <h1>Blood Sugar / A1C Calculator</h1>
        <p className="subtitle">Convert fasting glucose, A1C, and estimated average glucose with reference-only risk bands.</p>

        <h2 style={{ marginTop: 28 }}>Local calculation model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/blood-sugar-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lab inputs</h2>
              <p className="tool-description">Choose which value should drive the conversion.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="blood-sugar-mode">
              Input mode
              <select className="input" id="blood-sugar-mode" onChange={(event) => updateMode(event.target.value as BloodSugarInputMode)} value={values.inputMode}>
                <option value="fpg">Fasting glucose</option>
                <option value="a1c">A1C</option>
                <option value="eag">Average glucose</option>
              </select>
            </label>
            <label className="field-label" htmlFor="blood-sugar-fpg">
              Fasting glucose
              <input className="input" id="blood-sugar-fpg" min={0} onChange={(event) => updateNumber("fastingGlucose", event.target.value)} step="0.1" type="number" value={values.fastingGlucose} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-fpg-unit">
              FPG unit
              <select className="input" id="blood-sugar-fpg-unit" onChange={(event) => updateUnit("fastingGlucoseUnit", event.target.value as GlucoseUnit)} value={values.fastingGlucoseUnit}>
                <option value="mmoll">mmol/L</option>
                <option value="mgdl">mg/dL</option>
              </select>
            </label>
            <label className="field-label" htmlFor="blood-sugar-a1c">
              A1C
              <input className="input" id="blood-sugar-a1c" min={0} onChange={(event) => updateNumber("a1c", event.target.value)} step="0.1" type="number" value={values.a1c} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-eag">
              Average glucose
              <input className="input" id="blood-sugar-eag" min={0} onChange={(event) => updateNumber("averageGlucose", event.target.value)} step="1" type="number" value={values.averageGlucose} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-eag-unit">
              eAG unit
              <select className="input" id="blood-sugar-eag-unit" onChange={(event) => updateUnit("averageGlucoseUnit", event.target.value as GlucoseUnit)} value={values.averageGlucoseUnit}>
                <option value="mgdl">mg/dL</option>
                <option value="mmoll">mmol/L</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save lab values
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Convert blood sugar
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Blood sugar summary</h2>
              <p className="tool-description">{result ? result.summary : "Run conversion to show equivalent lab values and risk band."}</p>
            </div>
            <span className="badge warn">WHO / ADA reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFastingGlucose ?? "0.0 mmol/L"}</strong>
              <span>Fasting glucose</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedA1c ?? "0.0%"}</strong>
              <span>A1C</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverageGlucose ?? "0 mg/dL"}</strong>
              <span>Average glucose</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.riskBand ?? "Pending"}</strong>
              <span>Risk band</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplet size={18} aria-hidden="true" />
            <span>
              <strong>{result?.advice ?? "Waiting for conversion"}</strong>
              <small>{result ? "Use results as lab-reference context only." : "Convert first to review blood sugar context."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Blood sugar notes</h2>
        <div className="remediation-list">
          {sugarNotes.map((item, index) => (
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
          <p>Lab values stay in the browser and cannot replace professional diagnosis or treatment guidance.</p>
        </div>
      </aside>
    </div>
  );
}
