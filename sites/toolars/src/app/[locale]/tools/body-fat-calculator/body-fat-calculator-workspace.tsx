"use client";

import { Calculator, Ruler, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateBodyFat, defaultBodyFatScenario, type BodyFatInput, type BodyFatResult, type BodyFatSex } from "@/lib/tools/body-fat-calculator";

const trustRows = [
  ["Local", "Circumference measurements stay in this browser session", "local"],
  ["Reference", "US Navy estimates are not DEXA or clinical body composition tests", "warn"],
  ["Private", "Saved measurements stay in local browser storage", ""]
] as const;

const measurementNotes = [
  "Measure neck and waist consistently, ideally at the same time of day.",
  "Female calculations use hip measurement; male calculations use waist minus neck.",
  "Hydration, posture, tape tension, and training state can move the estimate."
];

export function BodyFatCalculatorWorkspace() {
  const [measurements, setMeasurements] = useState<BodyFatInput>(defaultBodyFatScenario);
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const calculate = () => {
    setResult(calculateBodyFat(measurements));
  };

  const saveMeasurements = () => {
    window.localStorage.setItem("toolars.body-fat-calculator.measurements", JSON.stringify(measurements));
  };

  const updateNumber = (key: keyof Pick<BodyFatInput, "heightCm" | "neckCm" | "waistCm" | "hipCm" | "weightKg">, value: string) => {
    setMeasurements((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateSex = (value: BodyFatSex) => {
    setMeasurements((current) => ({
      ...current,
      sex: value
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="body-fat-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>Body Fat Calculator</h1>
        <p className="subtitle">Estimate body fat percentage using the US Navy circumference method.</p>

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
          <a className="button button-outline" href="/tools/body-fat-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Measurement inputs</h2>
              <p className="tool-description">Use circumference measurements in centimeters; weight enables fat and lean mass estimates.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="body-fat-sex">
              Sex
              <select className="input" id="body-fat-sex" onChange={(event) => updateSex(event.target.value as BodyFatSex)} value={measurements.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="body-fat-weight">
              Weight (kg)
              <input className="input" id="body-fat-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={measurements.weightKg} />
            </label>
            <label className="field-label" htmlFor="body-fat-height">
              Height (cm)
              <input className="input" id="body-fat-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={measurements.heightCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-neck">
              Neck (cm)
              <input className="input" id="body-fat-neck" min={0} onChange={(event) => updateNumber("neckCm", event.target.value)} type="number" value={measurements.neckCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-waist">
              Waist (cm)
              <input className="input" id="body-fat-waist" min={0} onChange={(event) => updateNumber("waistCm", event.target.value)} type="number" value={measurements.waistCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-hip">
              Hip (cm)
              <input className="input" id="body-fat-hip" min={0} onChange={(event) => updateNumber("hipCm", event.target.value)} type="number" value={measurements.hipCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveMeasurements} type="button">
              <Save size={16} aria-hidden="true" /> Save measurements
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate body fat
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Body composition result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate body fat and mass split."}</p>
            </div>
            <span className="badge warn">{result?.formulaLabel ?? "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBodyFat ?? "0.0%"}</strong>
              <span>Body fat</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? "Pending"}</strong>
              <span>Reference category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatMass ?? "0.0 kg"}</strong>
              <span>Fat mass</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLeanMass ?? "0.0 kg"}</strong>
              <span>Lean mass</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Ruler size={18} aria-hidden="true" />
            <span>
              <strong>{result?.tip ?? "Waiting for calculation"}</strong>
              <small>{result ? "Compare trends using the same method instead of mixing measurement systems." : "Calculate first to get a reference category."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Measurement notes</h2>
        <div className="remediation-list">
          {measurementNotes.map((item, index) => (
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
          <p>No account data is required. Use results as fitness planning estimates, not clinical diagnosis.</p>
        </div>
      </aside>
    </div>
  );
}
