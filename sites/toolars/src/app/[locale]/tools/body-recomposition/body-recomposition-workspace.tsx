"use client";
import { useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { bodyRecompositionActivityLevels, bodyRecompositionGoals, calculateBodyRecomposition, defaultBodyRecompositionScenario, type BodyRecompositionGoal, type BodyRecompositionInput, type BodyRecompositionResult, type BodyRecompositionSex } from "@/lib/tools/body-recomposition";

const trustRows = [
  ["Local", "Body data and goal assumptions stay in this browser session", "local"],
  ["Reference", "Recomp targets are planning estimates paired with training", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const recompNotes = [
  "Body recomposition usually uses maintenance or a small deficit with resistance training.",
  "Protein near 2.0 g/kg supports muscle retention and synthesis in the source model.",
  "Use measurements, gym performance, sleep, and recovery trends before changing targets."
];

export function BodyRecompositionWorkspace() {
  const t = useTranslations("tools.body-recomposition");
  const [plan, setPlan] = useState<BodyRecompositionInput>(defaultBodyRecompositionScenario);
  const [result, setResult] = useState<BodyRecompositionResult | null>(null);

  const calculate = () => {
    setResult(calculateBodyRecomposition(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.body-recomposition.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Pick<BodyRecompositionInput, "age" | "heightCm" | "weightKg" | "activityMultiplier">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: BodyRecompositionSex) => {
    setPlan((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  const updateGoal = (value: BodyRecompositionGoal) => {
    setPlan((current) => ({ ...current, goal: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="body-recomposition">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc body composition workspace</span>
        <h1>Body Recomposition Calculator</h1>
        <p className="subtitle">Calculate target calories and macros for simultaneous fat loss and muscle gain.</p>

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
          <a className="button button-outline" href="/tools/body-recomposition/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Recomposition inputs</h2>
              <p className="tool-description">Use the VitalCalc sample profile, then adjust activity and goal.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="recomp-sex">
              Sex
              <select className="input" id="recomp-sex" onChange={(event) => updateSex(event.target.value as BodyRecompositionSex)} value={plan.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="recomp-age">
              Age
              <input className="input" id="recomp-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={plan.age} />
            </label>
            <label className="field-label" htmlFor="recomp-height">
              Height (cm)
              <input className="input" id="recomp-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={plan.heightCm} />
            </label>
            <label className="field-label" htmlFor="recomp-weight">
              Weight (kg)
              <input className="input" id="recomp-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="recomp-activity">
              Activity level
              <select className="input" id="recomp-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={plan.activityMultiplier}>
                {bodyRecompositionActivityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} ({level.value})
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="recomp-goal">
              Goal
              <select className="input" id="recomp-goal" onChange={(event) => updateGoal(event.target.value as BodyRecompositionGoal)} value={plan.goal}>
                {bodyRecompositionGoals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label} (-{goal.deficit} kcal)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save recomp plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate recomp plan
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Recomp plan result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate calories and macro split."}</p>
            </div>
            <span className="badge warn">Recomp</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTargetCalories ?? "0 kcal"}</strong>
              <span>Target calories</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTdee ?? "0 kcal"}</strong>
              <span>TDEE</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>Protein</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCarbs ?? "0 g"}</strong>
              <span>Carbs</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFat ?? "0 g"}</strong>
              <span>Fat</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.macroPercentSummary ?? "Waiting for calculation"}</strong>
              <small>{result?.recommendation ?? "Calculate first to get calories and macro targets."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Recomp notes</h2>
        <div className="remediation-list">
          {recompNotes.map((item, index) => (
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
          <p>No account data is required. Recomposition results are planning estimates, not a coached training plan.</p>
        </div>
      </aside>
    </div>
  );
}
