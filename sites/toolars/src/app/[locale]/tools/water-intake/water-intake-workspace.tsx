"use client";
import { useTranslations } from "next-intl";

import { Calculator, Droplets, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateWaterIntake, climateOptions, defaultWaterIntakeScenario, waterActivityLevels, type WaterIntakeInput, type WaterIntakeResult } from "@/lib/tools/water-intake";

const trustRows = [
  ["Local", "Hydration assumptions stay in this browser session", "local"],
  ["Reference", "Water targets change with health status, sweat, and climate", "warn"],
  ["Private", "Save only stores the hydration plan locally", ""]
] as const;

const hydrationNotes = [
  "The VitalCalc base uses 35 ml per kg of body weight before adjustments.",
  "Activity and hot climates increase estimated fluid needs; cold climates reduce the adjustment.",
  "Heart, kidney, pregnancy, medication, or endurance contexts need qualified guidance."
];

export function WaterIntakeWorkspace() {
  const t = useTranslations("tools.water-intake");
  const [plan, setPlan] = useState<WaterIntakeInput>(defaultWaterIntakeScenario);
  const [result, setResult] = useState<WaterIntakeResult | null>(null);

  const calculate = () => {
    setResult(calculateWaterIntake(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.water-intake.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof WaterIntakeInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="water-intake">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>Water Intake Calculator</h1>
        <p className="subtitle">Calculate a daily hydration target from weight, activity, and climate.</p>

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
          <a className="button button-outline" href="/tools/water-intake/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Hydration inputs</h2>
              <p className="tool-description">Use weight, activity multiplier, and climate adjustment from the VitalCalc source page.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="water-weight">
              Weight (kg)
              <input className="input" id="water-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="water-activity">
              Activity level
              <select className="input" id="water-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={plan.activityMultiplier}>
                {waterActivityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} ({level.value})
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="water-climate">
              Climate
              <select className="input" id="water-climate" onChange={(event) => updateNumber("climateAdjustment", event.target.value)} value={plan.climateAdjustment}>
                {climateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.value >= 0 ? "+" : ""}{option.value})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save hydration plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate water intake
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Hydration result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate water target and adjustment split."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotal ?? "0 ml"}</strong>
              <span>Daily target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCups ?? "0 cups"}</strong>
              <span>250 ml cups</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBaseNeed ?? "0 ml"}</strong>
              <span>Base need</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedActivityExtra ?? "+0 ml"}</strong>
              <span>Activity extra</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedClimateExtra ?? "+0 ml"}</strong>
              <span>Climate extra</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplets size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use urine color, thirst, sweat rate, and clinician guidance to adjust." : "Calculate first to get the hydration split."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Hydration notes</h2>
        <div className="remediation-list">
          {hydrationNotes.map((item, index) => (
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
          <p>No account data is required. Hydration results are planning estimates and should be adjusted to real conditions.</p>
        </div>
      </aside>
    </div>
  );
}
