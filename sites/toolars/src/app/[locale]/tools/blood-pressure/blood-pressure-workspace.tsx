"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { calculateBloodPressure, defaultBloodPressureReading, type BloodPressureInput, type BloodPressureResult } from "@/lib/tools/blood-pressure";

const trustRows = [
  ["Local", "Systolic and diastolic readings stay in this browser session", "local"],
  ["Reference", "Blood pressure categories are not a diagnosis", "warn"],
  ["Private", "Save only stores the local reading when you choose it", ""]
] as const;

const bpNotes = [
  "VitalCalc classifies readings using ACC/AHA-style systolic and diastolic thresholds.",
  "Blood pressure changes with activity, mood, medication, time of day, and measurement technique.",
  "Crisis-level or concerning readings require qualified medical attention."
];

export function BloodPressureWorkspace() {
  const t = useTranslations("tools.blood-pressure");
  const [reading, setReading] = useState<BloodPressureInput>(() => defaultBloodPressureReading);
  const [result, setResult] = useState<BloodPressureResult | null>(null);

  const calculate = () => {
    setResult(calculateBloodPressure(reading));
  };

  const saveReading = () => {
    try {
      window.localStorage.setItem("toolars.blood-pressure.reading", JSON.stringify(reading));
    } catch {}
  };

  const updateNumber = (key: keyof BloodPressureInput, value: string) => {
    setReading((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="blood-pressure">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health reference workspace</span>
        <h1>Blood Pressure Calculator</h1>
        <p className="subtitle">Classify systolic and diastolic readings locally with strong medical caveats.</p>

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
          <a className="button button-outline" href="/tools/blood-pressure/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Reading inputs</h2>
              <p className="tool-description">Enter one resting blood pressure reading in mmHg.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="bp-systolic">
              Systolic
              <input className="input" id="bp-systolic" min={0} onChange={(event) => updateNumber("systolic", event.target.value)} type="number" value={reading.systolic} />
            </label>
            <label className="field-label" htmlFor="bp-diastolic">
              Diastolic
              <input className="input" id="bp-diastolic" min={0} onChange={(event) => updateNumber("diastolic", event.target.value)} type="number" value={reading.diastolic} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveReading} type="button">
              <Save size={16} aria-hidden="true" /> Save reading
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Classify blood pressure
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Blood pressure summary</h2>
              <p className="tool-description">{result ? `${result.formattedReading} mmHg` : "Run calculation to classify the reading."}</p>
            </div>
            <span className="badge warn">ACC/AHA reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? t(`category.${result.category}.label`) : "Pending"}</strong>
              <span>Category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReading ?? "0/0"}</strong>
              <span>Reading</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.systolic}` : "0"}</strong>
              <span>Systolic</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.diastolic}` : "0"}</strong>
              <span>Diastolic</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`category.${result.category}.reason`) : "Waiting for calculation"}</strong>
              <small>{result ? t(`category.${result.category}.advice`) : "Calculate first to review the reference category."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Blood pressure notes</h2>
        <div className="remediation-list">
          {bpNotes.map((item, index) => (
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
          <p>Blood pressure readings stay in the browser and require clinician interpretation when concerning.</p>
        </div>
      </aside>
    </div>
  );
}
