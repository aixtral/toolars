"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  activityLevels,
  calculateTdee,
  defaultTdeeScenario,
  type TdeeInput,
  type TdeeResult
} from "@/lib/tools/tdee-calculator";

const trustRows = [
  ["Local", "BMR and activity assumptions stay in this browser session", "local"],
  ["Reference", "TDEE is a planning baseline, not a metabolic measurement", "warn"],
  ["Privacy", "Save only when you choose local profile storage", ""]
] as const;

const nutritionNotes = [
  "TDEE estimates maintenance calories from BMR and activity multiplier.",
  "Fat-loss and muscle-gain targets should be adjusted from weekly trend data.",
  "Medical conditions, pregnancy, medication, and eating-disorder history need qualified care."
];

export function TdeeCalculatorWorkspace() {
  const [profile, setProfile] = useState<TdeeInput>(defaultTdeeScenario);
  const [result, setResult] = useState<TdeeResult | null>(null);

  const calculate = () => {
    setResult(calculateTdee(profile));
  };

  const saveProfile = () => {
    window.localStorage.setItem("toolars.tdee-calculator.profile", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof TdeeInput, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="tdee-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>TDEE Calculator</h1>
        <p className="subtitle">Calculate total daily energy expenditure from BMR and activity level.</p>

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
          <a className="button button-outline" href="/tools/tdee-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Energy inputs</h2>
              <p className="tool-description">Use the VitalCalc sample BMR and choose the closest activity multiplier.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="tdee-bmr">
              BMR
              <input className="input" id="tdee-bmr" min={0} onChange={(event) => updateNumber("bmr", event.target.value)} type="number" value={profile.bmr} />
            </label>
            <label className="field-label" htmlFor="tdee-activity">
              Activity level
              <select className="input" id="tdee-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={profile.activityMultiplier}>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} ({level.value})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
              <Save size={16} aria-hidden="true" /> Save profile
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate TDEE
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Daily energy result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate maintenance and planning targets."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTdee ?? "0"}</strong>
              <span>TDEE</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedActivityBurn ?? "0 kcal"}</strong>
              <span>Activity burn</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatLossTarget ?? "0"}</strong>
              <span>Fat-loss target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMuscleGainTarget ?? "0"}</strong>
              <span>Muscle-gain target</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use the result as a baseline, then adjust by weight trend and training response." : "Calculate first to get planning targets."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Nutrition planning notes</h2>
        <div className="remediation-list">
          {nutritionNotes.map((item, index) => (
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
          <p>No account storage is required. TDEE results are planning estimates, not a clinical nutrition plan.</p>
        </div>
      </aside>
    </div>
  );
}
