"use client";

import { Calculator, Dumbbell, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateOneRepMax,
  defaultOneRepMaxScenario,
  type OneRepMaxInput,
  type OneRepMaxResult
} from "@/lib/tools/one-rep-max";

const storageKey = "toolars.one-rep-max.lift:v1";

const trustRows = [
  ["Local", "Lift weight and reps stay in this browser session", "local"],
  ["Training", "1RM estimates are planning references, not max-test instructions", "warn"],
  ["Private", "Save stores only this lift sample locally", ""]
] as const;

const strengthNotes = [
  "VitalCalc uses the Epley formula: 1RM = weight x (1 + reps / 30).",
  "The estimate is most useful for 1-10 completed reps; accuracy drops at higher rep counts.",
  "Use spotters, warmups, and coaching when testing heavy singles."
];

export function OneRepMaxWorkspace() {
  const [lift, setLift] = useState<OneRepMaxInput>(() => defaultOneRepMaxScenario);
  const [result, setResult] = useState<OneRepMaxResult | null>(null);

  const calculate = () => {
    setResult(calculateOneRepMax(lift));
  };

  const saveLift = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lift));
    } catch {}
  };

  const updateNumber = (key: keyof OneRepMaxInput, value: string) => {
    setLift((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="one-rep-max">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc strength workspace</span>
        <h1>1RM Calculator</h1>
        <p className="subtitle">Estimate one-repetition maximum and percentage-based working sets from weight and reps.</p>

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
          <a className="button button-outline" href="/tools/one-rep-max/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lift inputs</h2>
              <p className="tool-description">Enter a working set you completed with stable form.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="one-rep-weight">
              Working weight (kg)
              <input className="input" id="one-rep-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={lift.weightKg} />
            </label>
            <label className="field-label" htmlFor="one-rep-reps">
              Completed reps
              <input className="input" id="one-rep-reps" min={1} onChange={(event) => updateNumber("reps", event.target.value)} type="number" value={lift.reps} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveLift} type="button">
              <Save size={16} aria-hidden="true" /> Save lift
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate 1RM
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Strength result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate max strength and training weights."}</p>
            </div>
            <span className="badge warn">{result?.accuracyLabel ?? "Epley"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedOneRepMax ?? "0.0 kg"}</strong>
              <span>Estimated 1RM</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.accuracyLabel ?? "--"}</strong>
              <span>Accuracy band</span>
            </article>
            <article className="llm-metric">
              <strong>{lift.reps}</strong>
              <span>Input reps</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.percentageRows.length ?? 0}</strong>
              <span>Working sets</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.percentageRows ?? []).map((row) => (
              <div className="profile-row" key={row.percentage}>
                <span className="badge">{row.percentage}%</span>
                <span>
                  <strong>{row.formattedWeight}</strong>
                  <small style={{ display: "block", marginTop: 2 }}>{row.label}</small>
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Dumbbell size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use percentages as training targets, not a mandate to max out." : "Calculate first to build the percentage table."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Strength notes</h2>
        <div className="remediation-list">
          {strengthNotes.map((item, index) => (
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
          <p>Lift data stays local and should be interpreted with safe training practice.</p>
        </div>
      </aside>
    </div>
  );
}
