"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateHomaIr,
  defaultHomaIrScenario,
  type FastingGlucoseUnit,
  type FastingInsulinUnit,
  type HomaIrInput,
  type HomaIrResult
} from "@/lib/tools/homa-ir";

const storageKey = "toolars.homa-ir.labs:v1";

const trustRows = [
  ["Local", "Glucose and insulin values stay in this browser session", "local"],
  ["Lab caveat", "Reference bands vary by lab, ethnicity, and clinician context", "warn"],
  ["Private", "Save stores only this lab sample locally", ""]
] as const;

const homaNotes = [
  "VitalCalc uses HOMA-IR = fasting glucose mmol/L x fasting insulin uU/mL / 22.5.",
  "General reference bands: < 2.0 normal, 2.0-2.5 borderline, > 2.5 insulin resistance.",
  "HOMA-IR is a screening reference and cannot replace diagnosis or treatment guidance."
];

export function HomaIrWorkspace() {
  const [values, setValues] = useState<HomaIrInput>(() => defaultHomaIrScenario);
  const [result, setResult] = useState<HomaIrResult | null>(null);

  const calculate = () => {
    setResult(calculateHomaIr(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<HomaIrInput, "fastingGlucose" | "fastingInsulin">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="homa-ir">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc lab reference workspace</span>
        <h1>HOMA-IR Calculator</h1>
        <p className="subtitle">Estimate insulin resistance from fasting glucose and fasting insulin lab values.</p>

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
          <a className="button button-outline" href="/tools/homa-ir/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lab inputs</h2>
              <p className="tool-description">Enter fasting glucose and insulin with source-supported unit conversions.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="homa-glucose">
              Fasting glucose
              <input className="input" id="homa-glucose" min={0} onChange={(event) => updateNumber("fastingGlucose", event.target.value)} step="0.1" type="number" value={values.fastingGlucose} />
            </label>
            <label className="field-label" htmlFor="homa-glucose-unit">
              Glucose unit
              <select className="input" id="homa-glucose-unit" onChange={(event) => setValues((current) => ({ ...current, fastingGlucoseUnit: event.target.value as FastingGlucoseUnit }))} value={values.fastingGlucoseUnit}>
                <option value="mmoll">mmol/L</option>
                <option value="mgdl">mg/dL</option>
              </select>
            </label>
            <label className="field-label" htmlFor="homa-insulin">
              Fasting insulin
              <input className="input" id="homa-insulin" min={0} onChange={(event) => updateNumber("fastingInsulin", event.target.value)} step="0.1" type="number" value={values.fastingInsulin} />
            </label>
            <label className="field-label" htmlFor="homa-insulin-unit">
              Insulin unit
              <select className="input" id="homa-insulin-unit" onChange={(event) => setValues((current) => ({ ...current, fastingInsulinUnit: event.target.value as FastingInsulinUnit }))} value={values.fastingInsulinUnit}>
                <option value="uUml">uU/mL</option>
                <option value="pmoll">pmol/L</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save lab values
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate HOMA-IR
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Insulin resistance summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show HOMA-IR value and range."}</p>
            </div>
            <span className="badge warn">{result?.level ?? "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedHomaIr ?? "0.00"}</strong>
              <span>HOMA-IR</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.level ?? "Pending"}</strong>
              <span>Range</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGlucose ?? "0.0 mmol/L"}</strong>
              <span>Glucose</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInsulin ?? "0.0 uU/mL"}</strong>
              <span>Insulin</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.level ?? "Waiting for calculation"}</strong>
              <small>{result?.interpretation ?? "Calculate first to review the lab reference range."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>HOMA-IR notes</h2>
        <div className="remediation-list">
          {homaNotes.map((item, index) => (
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
          <p>Lab values stay local and should be interpreted with a qualified clinician when needed.</p>
        </div>
      </aside>
    </div>
  );
}
