"use client";

import { Calculator, Save, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";
import {
  calculateRunningPace,
  defaultRunningPaceScenario,
  runningDistanceOptions,
  type RunningDistancePreset,
  type RunningPaceInput,
  type RunningPaceResult
} from "@/lib/tools/running-pace";

const storageKey = "toolars.running-pace.plan:v1";

const trustRows = [
  ["Local", "Race distance and target time stay in this browser session", "local"],
  ["Training", "Equivalent times are estimates and depend on conditions", "warn"],
  ["Private", "Save stores only this race plan locally", ""]
] as const;

const raceNotes = [
  "VitalCalc calculates pace as target time divided by distance.",
  "Equivalent performances use the Riegel formula: T2 = T1 x (D2 / D1)^1.06.",
  "Terrain, weather, pacing, fueling, and training volume can move results."
];

export function RunningPaceWorkspace() {
  const [plan, setPlan] = useState<RunningPaceInput>(() => defaultRunningPaceScenario);
  const [result, setResult] = useState<RunningPaceResult | null>(null);

  const calculate = () => {
    setResult(calculateRunningPace(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<RunningPaceInput, "customDistanceKm" | "hours" | "minutes" | "seconds">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updatePreset = (value: RunningDistancePreset) => {
    setPlan((current) => ({ ...current, distancePreset: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="running-pace">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc race workspace</span>
        <h1>Running Pace Calculator</h1>
        <p className="subtitle">Calculate target pace, speed, 400m split, and equivalent race performances.</p>

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
          <a className="button button-outline" href="/tools/running-pace/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Race inputs</h2>
              <p className="tool-description">Choose a common race distance or enter a custom distance and time.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="running-distance">
              Distance
              <select className="input" id="running-distance" onChange={(event) => updatePreset(event.target.value as RunningDistancePreset)} value={plan.distancePreset}>
                {runningDistanceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="running-custom-distance">
              Custom distance (km)
              <input className="input" id="running-custom-distance" min={0.1} onChange={(event) => updateNumber("customDistanceKm", event.target.value)} step="0.1" type="number" value={plan.customDistanceKm} />
            </label>
            <label className="field-label" htmlFor="running-hours">
              Target hours
              <input className="input" id="running-hours" min={0} onChange={(event) => updateNumber("hours", event.target.value)} type="number" value={plan.hours} />
            </label>
            <label className="field-label" htmlFor="running-minutes">
              Target minutes
              <input className="input" id="running-minutes" max={59} min={0} onChange={(event) => updateNumber("minutes", event.target.value)} type="number" value={plan.minutes} />
            </label>
            <label className="field-label" htmlFor="running-seconds">
              Target seconds
              <input className="input" id="running-seconds" max={59} min={0} onChange={(event) => updateNumber("seconds", event.target.value)} type="number" value={plan.seconds} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save race plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate pace
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Pace result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show target pace and equivalent performances."}</p>
            </div>
            <span className="badge warn">Riegel</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedPacePerKm ?? "--"}</strong>
              <span>Pace per km</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPacePerMile ?? "--"}</strong>
              <span>Pace per mile</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSpeed ?? "--"}</strong>
              <span>Speed</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLap400m ?? "--"}</strong>
              <span>400m split</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.equivalents ?? []).map((equivalent) => (
              <div className="profile-row" key={equivalent.name}>
                <span className="badge">{equivalent.name}</span>
                <span>
                  <strong>{equivalent.formattedTime}</strong> - {equivalent.formattedPace}/km
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Timer size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? `Target time ${result.formattedTargetTime}` : "Calculate first to create race splits."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Race notes</h2>
        <div className="remediation-list">
          {raceNotes.map((item, index) => (
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
          <p>Race targets stay local and are meant for training planning, not medical clearance.</p>
        </div>
      </aside>
    </div>
  );
}
