"use client";

import { Calculator, Save, Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateGlp1Eligibility,
  defaultGlp1EligibilityScenario,
  glp1ComorbidityLabels,
  type Glp1Comorbidity,
  type Glp1EligibilityInput,
  type Glp1EligibilityResult
} from "@/lib/tools/glp1-eligibility";

const storageKey = "toolars.glp1-eligibility.snapshot:v1";

const trustRows = [
  ["Local", "Height, weight, and checkbox inputs stay in this browser session", "local"],
  ["Medical", "This is education for clinician discussion, not a prescription decision", "warn"],
  ["Private", "Save stores only this local eligibility snapshot", ""]
] as const;

const prescriptionNotes = [
  "VitalCalc checks common criteria: BMI >= 30 or BMI >= 27 with a weight-related comorbidity.",
  "Contraindications, medications, pregnancy status, labs, and side effects require clinician review.",
  "Medication names and coverage vary by country, indication, and current label."
];

export function Glp1EligibilityWorkspace() {
  const [values, setValues] = useState<Glp1EligibilityInput>(() => defaultGlp1EligibilityScenario);
  const [result, setResult] = useState<Glp1EligibilityResult | null>(null);

  const calculate = () => {
    setResult(calculateGlp1Eligibility(values));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<Glp1EligibilityInput, "heightCm" | "weightKg">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const toggleComorbidity = (comorbidity: Glp1Comorbidity) => {
    setValues((current) => ({
      ...current,
      comorbidities: current.comorbidities.includes(comorbidity) ? current.comorbidities.filter((item) => item !== comorbidity) : [...current.comorbidities, comorbidity]
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="glp1-eligibility">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc medical discussion workspace</span>
        <h1>GLP-1 Eligibility Check</h1>
        <p className="subtitle">Check common BMI and comorbidity criteria for a clinician conversation about GLP-1 medications.</p>

        <h2 style={{ marginTop: 28 }}>Local criteria model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/glp1-eligibility/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Eligibility inputs</h2>
              <p className="tool-description">Enter body measurements and select any relevant weight-related comorbidities.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="glp1-eligibility-height">
              Height (cm)
              <input className="input" id="glp1-eligibility-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={values.heightCm} />
            </label>
            <label className="field-label" htmlFor="glp1-eligibility-weight">
              Weight (kg)
              <input className="input" id="glp1-eligibility-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(Object.keys(glp1ComorbidityLabels) as Glp1Comorbidity[]).map((key) => (
              <label className="profile-row" key={key} htmlFor={`glp1-${key}`}>
                <input checked={values.comorbidities.includes(key)} id={`glp1-${key}`} onChange={() => toggleComorbidity(key)} type="checkbox" />
                <span>{glp1ComorbidityLabels[key]}</span>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
              <Save size={16} aria-hidden="true" /> Save eligibility snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Check common criteria
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Criteria result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show BMI category and criteria status."}</p>
            </div>
            <span className="badge warn">Medical review</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? "0.0"}</strong>
              <span>BMI</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.bmiCategory ?? "--"}</strong>
              <span>BMI category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.criteriaStatus ?? "--"}</strong>
              <span>Criteria</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.comorbidityLabel ?? "None selected"}</strong>
              <span>Comorbidity context</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Scale size={18} aria-hidden="true" />
            <span>
              <strong>{result?.medicationNote ?? "Waiting for calculation"}</strong>
              <small>{result ? "Bring the snapshot to a qualified clinician; Toolars does not prescribe or recommend medication." : "Calculate first to review common criteria."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Prescription notes</h2>
        <div className="remediation-list">
          {prescriptionNotes.map((item, index) => (
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
          <p>Eligibility inputs stay local. This workspace is educational and does not replace clinician review.</p>
        </div>
      </aside>
    </div>
  );
}
