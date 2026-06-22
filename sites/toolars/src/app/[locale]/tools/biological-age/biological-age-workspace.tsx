"use client";

import { Calculator, Clock3, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateBiologicalAge,
  defaultBiologicalAgeScenario,
  type AlcoholFrequency,
  type BiologicalAgeInput,
  type BiologicalAgeResult,
  type SmokingStatus,
  type StressLevel
} from "@/lib/tools/biological-age";

const storageKey = "toolars.biological-age.sample:v1";

const trustRows = [
  ["Local", "Lifestyle answers stay in this browser session", "local"],
  ["Reference", "This is an entertainment/reference model, not a biomarker test", "warn"],
  ["Private", "Save stores only this local lifestyle sample", ""]
] as const;

const lifestyleNotes = [
  "VitalCalc starts from chronological age and applies lifestyle deltas.",
  "BMI, blood pressure, sleep, smoking, alcohol, stress, and exercise each affect the delta.",
  "DNA methylation or clinical biomarkers are outside this simplified model."
];

export function BiologicalAgeWorkspace() {
  const [sample, setSample] = useState<BiologicalAgeInput>(() => defaultBiologicalAgeScenario);
  const [result, setResult] = useState<BiologicalAgeResult | null>(null);

  const calculate = () => {
    setResult(calculateBiologicalAge(sample));
  };

  const saveSample = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(sample));
    } catch {}
  };

  const updateSample = <Key extends keyof BiologicalAgeInput>(key: Key, value: BiologicalAgeInput[Key]) => {
    setSample((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="biological-age">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc lifestyle reference</span>
        <h1>Biological Age Calculator</h1>
        <p className="subtitle">Estimate a simplified biological-age score from lifestyle inputs and source delta rules.</p>

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
          <a className="button button-outline" href="/tools/biological-age/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lifestyle inputs</h2>
              <p className="tool-description">Enter the inputs used by the VitalCalc lifestyle delta model.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="bio-age-age">
              Chronological age
              <input className="input" id="bio-age-age" min={18} onChange={(event) => updateSample("chronologicalAge", Number(event.target.value))} type="number" value={sample.chronologicalAge} />
            </label>
            <label className="field-label" htmlFor="bio-age-bmi">
              BMI
              <input className="input" id="bio-age-bmi" min={0} onChange={(event) => updateSample("bmi", Number(event.target.value))} step="0.1" type="number" value={sample.bmi} />
            </label>
            <label className="field-label" htmlFor="bio-age-sbp">
              Systolic BP
              <input className="input" id="bio-age-sbp" min={0} onChange={(event) => updateSample("systolicBp", Number(event.target.value))} type="number" value={sample.systolicBp} />
            </label>
            <label className="field-label" htmlFor="bio-age-exercise">
              Exercise days/week
              <input className="input" id="bio-age-exercise" max={7} min={0} onChange={(event) => updateSample("exerciseDays", Number(event.target.value))} type="number" value={sample.exerciseDays} />
            </label>
            <label className="field-label" htmlFor="bio-age-sleep">
              Average sleep hours
              <input className="input" id="bio-age-sleep" min={0} onChange={(event) => updateSample("sleepHours", Number(event.target.value))} step="0.5" type="number" value={sample.sleepHours} />
            </label>
            <label className="field-label" htmlFor="bio-age-smoking">
              Smoking
              <select className="input" id="bio-age-smoking" onChange={(event) => updateSample("smoking", event.target.value as SmokingStatus)} value={sample.smoking}>
                <option value="no">No</option>
                <option value="former">Former</option>
                <option value="yes">Yes</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bio-age-alcohol">
              Alcohol
              <select className="input" id="bio-age-alcohol" onChange={(event) => updateSample("alcohol", event.target.value as AlcoholFrequency)} value={sample.alcohol}>
                <option value="never">Never</option>
                <option value="rare">Rarely</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bio-age-stress">
              Stress level
              <select className="input" id="bio-age-stress" onChange={(event) => updateSample("stress", event.target.value as StressLevel)} value={sample.stress}>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSample} type="button">
              <Save size={16} aria-hidden="true" /> Save lifestyle sample
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate biological age
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Biological age result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show age estimate, difference label, and improvement tips."}</p>
            </div>
            <span className="badge warn">Reference only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBiologicalAge ?? "0 years"}</strong>
              <span>Biological age</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.differenceLabel ?? "--"}</strong>
              <span>Age difference</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.delta.toFixed(1) ?? "0.0"}</strong>
              <span>Lifestyle delta</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.status ?? "--"}</strong>
              <span>Status</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.tips ?? []).map((tip) => (
              <div className="profile-row" key={tip}>
                <span className="badge">Tip</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Clock3 size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use as a lifestyle reflection tool, not a diagnostic result." : "Calculate first to get the lifestyle delta."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Lifestyle notes</h2>
        <div className="remediation-list">
          {lifestyleNotes.map((item, index) => (
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
          <p>Biological-age inputs stay local. This simplified model is for reference and entertainment only.</p>
        </div>
      </aside>
    </div>
  );
}
