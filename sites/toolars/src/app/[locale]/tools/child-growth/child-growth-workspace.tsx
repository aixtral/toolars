"use client";

import { Baby, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateChildGrowth, defaultChildGrowthProfile, type ChildGrowthInput, type ChildGrowthResult, type ChildGrowthSex } from "@/lib/tools/child-growth";

const trustRows = [
  ["Local", "Child age, height, and weight stay in this browser session", "local"],
  ["Reference", "Percentiles are approximate and require pediatric context", "warn"],
  ["Private", "Save only stores the local growth profile when you choose it", ""]
] as const;

const growthNotes = [
  "VitalCalc estimates BMI, then maps it to a simplified age and sex percentile approximation.",
  "Single measurements are less useful than trend over time on a pediatric growth chart.",
  "Growth interpretation depends on development stage, family history, and pediatric clinician review."
];

export function ChildGrowthWorkspace() {
  const [profile, setProfile] = useState<ChildGrowthInput>(() => defaultChildGrowthProfile);
  const [result, setResult] = useState<ChildGrowthResult | null>(null);

  const calculate = () => {
    setResult(calculateChildGrowth(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem("toolars.child-growth.profile", JSON.stringify(profile));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<ChildGrowthInput, "ageYears" | "ageMonths" | "heightCm" | "weightKg">, value: string) => {
    setProfile((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: ChildGrowthSex) => {
    setProfile((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="child-growth">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc pediatric reference workspace</span>
        <h1>Child BMI Growth Chart</h1>
        <p className="subtitle">Estimate child BMI percentile context from age, sex, height, and weight.</p>

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
          <a className="button button-outline" href="/tools/child-growth/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Growth inputs</h2>
              <p className="tool-description">Use ages 2-20 with metric height and weight.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="growth-sex">
              Sex
              <select className="input" id="growth-sex" onChange={(event) => updateSex(event.target.value as ChildGrowthSex)} value={profile.sex}>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
            </label>
            <label className="field-label" htmlFor="growth-age-years">
              Age years
              <input className="input" id="growth-age-years" min={2} onChange={(event) => updateNumber("ageYears", event.target.value)} type="number" value={profile.ageYears} />
            </label>
            <label className="field-label" htmlFor="growth-age-months">
              Age months
              <select className="input" id="growth-age-months" onChange={(event) => updateNumber("ageMonths", event.target.value)} value={profile.ageMonths}>
                <option value={0}>0 months</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={9}>9 months</option>
              </select>
            </label>
            <label className="field-label" htmlFor="growth-height">
              Height (cm)
              <input className="input" id="growth-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={profile.heightCm} />
            </label>
            <label className="field-label" htmlFor="growth-weight">
              Weight (kg)
              <input className="input" id="growth-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={profile.weightKg} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
              <Save size={16} aria-hidden="true" /> Save growth profile
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Assess growth curve
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Growth summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate BMI percentile context."}</p>
            </div>
            <span className="badge warn">CDC-style reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedPercentile ?? "0.0th"}</strong>
              <span>BMI percentile</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? "0.0"}</strong>
              <span>BMI</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? "Pending"}</strong>
              <span>Category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.idealWeightRange ?? "0.0-0.0 kg"}</strong>
              <span>Reference weight range</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Baby size={18} aria-hidden="true" />
            <span>
              <strong>{result?.rankLabel ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.ageLabel} percentile context from VitalCalc approximation.` : "Calculate first to review growth context."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Growth notes</h2>
        <div className="remediation-list">
          {growthNotes.map((item, index) => (
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
          <p>Child growth data stays local and should be reviewed as a trend with pediatric guidance.</p>
        </div>
      </aside>
    </div>
  );
}
