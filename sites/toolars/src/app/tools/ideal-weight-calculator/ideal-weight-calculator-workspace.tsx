"use client";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import {
  calculateIdealWeight,
  defaultIdealWeightScenario,
  type IdealWeightInput,
  type IdealWeightResult,
  type IdealWeightSex
} from "@/lib/tools/ideal-weight-calculator";

const storageKey = "toolars.ideal-weight-calculator.profile:v1";

const trustRows = [
  ["Local", "Height and sex stay in this browser session", "local"],
  ["Reference", "Devine range does not measure body composition", "warn"],
  ["Private", "Save stores only this body profile locally", ""]
] as const;

const bodyNotes = [
  "VitalCalc uses Devine: men 50 + 0.91 x (height cm - 152.4).",
  "Women use a 45.5 kg base with the same height adjustment.",
  "The displayed healthy range is +/-10% around the ideal value."
];

export function IdealWeightCalculatorWorkspace() {
  const [profile, setProfile] = useState<IdealWeightInput>(() => defaultIdealWeightScenario);
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  const calculate = () => {
    setResult(calculateIdealWeight(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {}
  };

  const updateProfile = <Key extends keyof IdealWeightInput>(key: Key, value: IdealWeightInput[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="ideal-weight-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc body reference</span>
        <h1>Ideal Weight Calculator</h1>
        <p className="subtitle">Estimate ideal weight and a +/-10% reference range from height and sex using the Devine formula.</p>

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
          <a className="button button-outline" href="/tools/ideal-weight-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Body inputs</h2>
              <p className="tool-description">Enter height and sex for the Devine reference calculation.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="ideal-weight-sex">
              Sex
              <select className="input" id="ideal-weight-sex" onChange={(event) => updateProfile("sex", event.target.value as IdealWeightSex)} value={profile.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="ideal-weight-height">
              Height (cm)
              <input className="input" id="ideal-weight-height" min={0} onChange={(event) => updateProfile("heightCm", Number(event.target.value))} type="number" value={profile.heightCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
              <Save size={16} aria-hidden="true" /> Save body profile
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate ideal weight
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Ideal weight result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show ideal weight and source healthy range."}</p>
            </div>
            <span className="badge warn">Devine</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedIdealWeight ?? "0.0 kg"}</strong>
              <span>Ideal weight</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMinimumWeight ?? "0.0 kg"}</strong>
              <span>Range low</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMaximumWeight ?? "0.0 kg"}</strong>
              <span>Range high</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formulaLabel ?? "--"}</strong>
              <span>Formula</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Compare with body composition and clinical context." : "Calculate first to build the reference range."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Body reference notes</h2>
        <div className="remediation-list">
          {bodyNotes.map((item, index) => (
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
          <p>Body reference inputs stay local and should not replace medical nutrition or body-composition review.</p>
        </div>
      </aside>
    </div>
  );
}
