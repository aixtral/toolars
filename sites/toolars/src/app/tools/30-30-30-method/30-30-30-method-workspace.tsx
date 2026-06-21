"use client";

import { Calculator, Save, ShieldCheck, SunMedium } from "lucide-react";
import { useState } from "react";
import {
  calculateThirtyThirtyThirty,
  defaultThirtyThirtyThirtyScenario,
  thirtyActivityReferences,
  type ThirtyActivity,
  type ThirtySex,
  type ThirtyThirtyThirtyInput,
  type ThirtyThirtyThirtyResult
} from "@/lib/tools/30-30-30-method";

const storageKey = "toolars.30-30-30-method.plan:v1";

const trustRows = [
  ["Local", "Morning routine inputs stay in this browser session", "local"],
  ["Nutrition", "Protein and calorie burn are planning references", "warn"],
  ["Private", "Save stores only this morning plan locally", ""]
] as const;

const routineNotes = [
  "VitalCalc uses a fixed 30g protein target and 30-minute low-intensity activity block.",
  "Exercise burn uses MET x body weight x 0.5 hours.",
  "This routine is a habit reference and should not replace personalized medical nutrition advice."
];

export function ThirtyThirtyThirtyMethodWorkspace() {
  const [plan, setPlan] = useState<ThirtyThirtyThirtyInput>(() => defaultThirtyThirtyThirtyScenario);
  const [result, setResult] = useState<ThirtyThirtyThirtyResult | null>(null);

  const calculate = () => {
    setResult(calculateThirtyThirtyThirty(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<ThirtyThirtyThirtyInput, "weightKg" | "age">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="30-30-30-method">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc morning routine workspace</span>
        <h1>30-30-30 Morning Method</h1>
        <p className="subtitle">Estimate a 30g protein target and 30-minute low-intensity exercise burn for a morning routine.</p>

        <h2 style={{ marginTop: 28 }}>Local routine model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/30-30-30-method/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Morning inputs</h2>
              <p className="tool-description">Enter body context and choose the low-intensity activity used by the source MET table.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="thirty-weight">
              Weight (kg)
              <input className="input" id="thirty-weight" min={30} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="thirty-age">
              Age
              <input className="input" id="thirty-age" min={18} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={plan.age} />
            </label>
            <label className="field-label" htmlFor="thirty-sex">
              Sex context
              <select className="input" id="thirty-sex" onChange={(event) => setPlan((current) => ({ ...current, sex: event.target.value as ThirtySex }))} value={plan.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="thirty-activity">
              Activity
              <select className="input" id="thirty-activity" onChange={(event) => setPlan((current) => ({ ...current, activity: event.target.value as ThirtyActivity }))} value={plan.activity}>
                {Object.entries(thirtyActivityReferences).map(([key, reference]) => (
                  <option key={key} value={key}>
                    {reference.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save morning plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate routine
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Routine result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show protein target and activity burn."}</p>
            </div>
            <span className="badge warn">Reference only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedProteinTarget ?? "30 g"}</strong>
              <span>Protein target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCalories ?? "0 kcal"}</strong>
              <span>30-minute burn</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.activityLabel ?? "--"}</strong>
              <span>Activity</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `MET ${result.met}` : "MET --"}</strong>
              <span>Source MET</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.proteinOptions ?? []).slice(0, 3).map((option) => (
              <div className="profile-row" key={option}>
                <span className="badge">Protein</span>
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <SunMedium size={18} aria-hidden="true" />
            <span>
              <strong>{result?.activityTip ?? "Waiting for calculation"}</strong>
              <small>{result ? "Keep the session gentle and adjust for medical, recovery, and nutrition context." : "Calculate first to build the routine."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Routine notes</h2>
        <div className="remediation-list">
          {routineNotes.map((item, index) => (
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
          <p>Routine data stays local. Adjust the method for eating disorder history, pregnancy, diabetes, or clinician guidance.</p>
        </div>
      </aside>
    </div>
  );
}
