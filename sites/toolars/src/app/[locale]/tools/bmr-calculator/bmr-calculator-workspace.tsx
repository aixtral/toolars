"use client";
import { useTranslations } from "next-intl";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateBmr, defaultBmrScenario, type BmrInput, type BmrResult, type BmrSex } from "@/lib/tools/bmr-calculator";

const trustRows = [
  ["Local", "Age, height, weight, and sex stay in this browser session", "local"],
  ["Formula", "Mifflin-St Jeor is a planning estimate, not a metabolic test", "warn"],
  ["Private", "Save only stores assumptions in local browser storage", ""]
] as const;

const formulaNotes = [
  "BMR estimates resting energy needs before activity is included.",
  "Use the TDEE workspace when you need activity-adjusted maintenance calories.",
  "Medical conditions, medication, and body composition can shift measured energy needs."
];

export function BmrCalculatorWorkspace() {
  const t = useTranslations("tools.bmr-calculator");
  const [profile, setProfile] = useState<BmrInput>(defaultBmrScenario);
  const [result, setResult] = useState<BmrResult | null>(null);

  const calculate = () => {
    setResult(calculateBmr(profile));
  };

  const saveAssumptions = () => {
    window.localStorage.setItem("toolars.bmr-calculator.assumptions", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof Pick<BmrInput, "age" | "heightCm" | "weightKg">, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateSex = (value: BmrSex) => {
    setProfile((current) => ({
      ...current,
      sex: value
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bmr-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>BMR Calculator</h1>
        <p className="subtitle">Calculate basal metabolic rate using the Mifflin-St Jeor formula.</p>

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
          <a className="button button-outline" href="/tools/bmr-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Metabolism inputs</h2>
              <p className="tool-description">Use the VitalCalc sample profile, then adjust age, sex, height, and weight.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="bmr-sex">
              Sex
              <select className="input" id="bmr-sex" onChange={(event) => updateSex(event.target.value as BmrSex)} value={profile.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bmr-age">
              Age
              <input className="input" id="bmr-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={profile.age} />
            </label>
            <label className="field-label" htmlFor="bmr-height">
              Height (cm)
              <input className="input" id="bmr-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={profile.heightCm} />
            </label>
            <label className="field-label" htmlFor="bmr-weight">
              Weight (kg)
              <input className="input" id="bmr-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={profile.weightKg} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveAssumptions} type="button">
              <Save size={16} aria-hidden="true" /> Save assumptions
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate BMR
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>BMR result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate resting energy needs."}</p>
            </div>
            <span className="badge warn">{result?.formulaLabel ?? "Formula"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmr ?? "0 kcal"}</strong>
              <span>BMR</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `Maintain: ${result.formattedMaintainTarget}` : "0 kcal"}</strong>
              <span>Maintain</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLossTarget ?? "0 kcal"}</strong>
              <span>Loss target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGainTarget ?? "0 kcal"}</strong>
              <span>Gain target</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "BMR is only the resting baseline; activity changes total daily needs." : "Calculate first to get a local reference."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Formula notes</h2>
        <div className="remediation-list">
          {formulaNotes.map((item, index) => (
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
          <p>No account data is required. Results are planning estimates, not a clinical metabolic measurement.</p>
        </div>
      </aside>
    </div>
  );
}
