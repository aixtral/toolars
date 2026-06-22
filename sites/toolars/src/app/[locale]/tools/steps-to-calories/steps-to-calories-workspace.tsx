"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateStepsToCalories,
  defaultStepsToCaloriesScenario,
  walkingSpeedOptions,
  type StepsToCaloriesInput,
  type StepsToCaloriesResult,
  type WalkingSpeed
} from "@/lib/tools/steps-to-calories";

const storageKey = "toolars.steps-to-calories.activity:v1";

const trustRows = [
  ["Local", "Steps, weight, height, and speed stay in this browser session", "local"],
  ["Activity", "Calorie burn is an estimate and varies by terrain", "warn"],
  ["Private", "Save stores only this activity sample locally", ""]
] as const;

const activityNotes = [
  "VitalCalc source uses height x 0.414 / 100 as stride length in meters.",
  "MET table: slow 2.5, normal 3.5, fast 5, running 8.",
  "Toolars normalizes source stride distance from meters to kilometers before applying km/h speed."
];

export function StepsToCaloriesWorkspace() {
  const [activity, setActivity] = useState<StepsToCaloriesInput>(() => defaultStepsToCaloriesScenario);
  const [result, setResult] = useState<StepsToCaloriesResult | null>(null);

  const calculate = () => {
    setResult(calculateStepsToCalories(activity));
  };

  const saveActivity = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(activity));
    } catch {}
  };

  const updateActivity = <Key extends keyof StepsToCaloriesInput>(key: Key, value: StepsToCaloriesInput[Key]) => {
    setActivity((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="steps-to-calories">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc activity workspace</span>
        <h1>Steps to Calories Calculator</h1>
        <p className="subtitle">Estimate walking calories from steps, body weight, height-derived stride, speed, and food equivalents.</p>

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
          <a className="button button-outline" href="/tools/steps-to-calories/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Activity inputs</h2>
              <p className="tool-description">Enter daily steps and context for the MET-based burn estimate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="steps-calories-steps">
              Steps today
              <input className="input" id="steps-calories-steps" min={0} onChange={(event) => updateActivity("steps", Number(event.target.value))} type="number" value={activity.steps} />
            </label>
            <label className="field-label" htmlFor="steps-calories-weight">
              Weight (kg)
              <input className="input" id="steps-calories-weight" min={0} onChange={(event) => updateActivity("weightKg", Number(event.target.value))} type="number" value={activity.weightKg} />
            </label>
            <label className="field-label" htmlFor="steps-calories-height">
              Height (cm)
              <input className="input" id="steps-calories-height" min={0} onChange={(event) => updateActivity("heightCm", Number(event.target.value))} type="number" value={activity.heightCm} />
            </label>
            <label className="field-label" htmlFor="steps-calories-speed">
              Walking speed
              <select className="input" id="steps-calories-speed" onChange={(event) => updateActivity("speed", event.target.value as WalkingSpeed)} value={activity.speed}>
                {walkingSpeedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveActivity} type="button">
              <Save size={16} aria-hidden="true" /> Save activity sample
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate burn
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Burn result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show calories, distance, and food equivalents."}</p>
            </div>
            <span className="badge warn">MET</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCalories ?? "0 kcal"}</strong>
              <span>Calories burned</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDistance ?? "0.00 km"}</strong>
              <span>Distance</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRiceEquivalent ?? "0.0 bowls rice"}</strong>
              <span>Equivalent</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedStepsPerRice ?? "0 steps"}</strong>
              <span>Steps per rice bowl</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {result ? (
              <>
                <div className="profile-row">
                  <span className="badge">Soda</span>
                  <span>{result.formattedSodaEquivalent}</span>
                </div>
                <div className="profile-row">
                  <span className="badge">Burger</span>
                  <span>{result.formattedBurgerEquivalent}</span>
                </div>
                <div className="profile-row">
                  <span className="badge">10k steps</span>
                  <span>{result.formattedTenThousandStepBurn}</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? `MET ${result.met}, stride ${result.strideMeters.toFixed(2)} m` : "Calculate first to build activity equivalents."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Activity notes</h2>
        <div className="remediation-list">
          {activityNotes.map((item, index) => (
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
          <p>Activity estimates stay local and are not a substitute for metabolic testing.</p>
        </div>
      </aside>
    </div>
  );
}
