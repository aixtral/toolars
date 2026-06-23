"use client";
import { useTranslations } from "next-intl";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateCalorieDeficit, defaultCalorieDeficitScenario, weeklyLossOptions, type CalorieDeficitInput, type CalorieDeficitResult } from "@/lib/tools/calorie-deficit";

const trustRows = [
  ["Local", "Weight goal and TDEE assumptions stay in this browser session", "local"],
  ["Reference", "1 kg fat is modeled as 7,700 kcal for planning", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const deficitNotes = [
  "A 300-500 kcal daily deficit is often more sustainable than aggressive cuts.",
  "Very low intake can increase muscle-loss and rebound risk.",
  "Pair the deficit with protein, strength training, sleep, and trend review."
];

export function CalorieDeficitWorkspace() {
  const t = useTranslations("tools.calorie-deficit");
  const [plan, setPlan] = useState<CalorieDeficitInput>(defaultCalorieDeficitScenario);
  const [result, setResult] = useState<CalorieDeficitResult | null>(null);

  const calculate = () => {
    setResult(calculateCalorieDeficit(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.calorie-deficit.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CalorieDeficitInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="calorie-deficit">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc nutrition workspace</span>
        <h1>Calorie Deficit Calculator</h1>
        <p className="subtitle">Calculate a safe daily intake target from TDEE and weekly loss pace.</p>

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
          <a className="button button-outline" href="/tools/calorie-deficit/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Weight-loss inputs</h2>
              <p className="tool-description">Use the VitalCalc sample target, then adjust TDEE and weekly loss pace.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="deficit-current-weight">
              Current weight (kg)
              <input className="input" id="deficit-current-weight" min={0} onChange={(event) => updateNumber("currentWeightKg", event.target.value)} type="number" value={plan.currentWeightKg} />
            </label>
            <label className="field-label" htmlFor="deficit-target-weight">
              Target weight (kg)
              <input className="input" id="deficit-target-weight" min={0} onChange={(event) => updateNumber("targetWeightKg", event.target.value)} type="number" value={plan.targetWeightKg} />
            </label>
            <label className="field-label" htmlFor="deficit-tdee">
              Daily burn (TDEE)
              <input className="input" id="deficit-tdee" min={0} onChange={(event) => updateNumber("tdeeCalories", event.target.value)} type="number" value={plan.tdeeCalories} />
            </label>
            <label className="field-label" htmlFor="deficit-weekly-loss">
              Weekly loss
              <select className="input" id="deficit-weekly-loss" onChange={(event) => updateNumber("weeklyLossKg", event.target.value)} value={plan.weeklyLossKg}>
                {weeklyLossOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save deficit plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate deficit
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Calorie target result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate daily intake and time horizon."}</p>
            </div>
            <span className={`badge ${result?.safetyTone === "warn" ? "warn" : "local"}`}>{result?.safetyTone === "warn" ? "Caution" : "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedDailyIntake ?? "0 kcal"}</strong>
              <span>Daily intake</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDailyDeficit ?? "0 kcal"}</strong>
              <span>Daily deficit</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEstimatedTime ?? "0 weeks"}</strong>
              <span>Estimated time</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatToLose ?? "0.0 kg"}</strong>
              <span>Fat to lose</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result?.safetyMessage ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use trend data and adjust slowly." : "Calculate first to get a planning target."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Deficit notes</h2>
        <div className="remediation-list">
          {deficitNotes.map((item, index) => (
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
          <p>No account data is required. Results are planning estimates, not medical nutrition therapy.</p>
        </div>
      </aside>
    </div>
  );
}
