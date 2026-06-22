"use client";

import { Calculator, Percent, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculatePercentage,
  defaultPercentageScenarios,
  percentageModeLabels,
  type PercentageInput,
  type PercentageMode,
  type PercentageResult
} from "@/lib/tools/percentage-calculator";

const trustRows = [
  ["Local", "Percentage inputs stay in this browser session", "local"],
  ["Context", "Label denominators before reusing percentage outputs", "warn"],
  ["Private", "Save only stores the percentage scenario locally when you choose it", ""]
] as const;

const denominatorNotes = [
  "VitalCalc percent-of uses percent divided by 100 times the base value.",
  "Ratio mode uses the second value as the denominator.",
  "Change mode uses the starting value as the denominator and labels increase or decrease."
];

export function PercentageCalculatorWorkspace() {
  const [plan, setPlan] = useState<PercentageInput>(defaultPercentageScenarios.percentOf);
  const [result, setResult] = useState<PercentageResult | null>(null);

  const calculate = () => {
    setResult(calculatePercentage(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.percentage-calculator.plan", JSON.stringify(plan));
  };

  const updateMode = (value: string) => {
    setPlan(defaultPercentageScenarios[value as PercentageMode]);
    setResult(null);
  };

  const updateNumber = (key: keyof Omit<PercentageInput, "mode">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="percentage-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc percent math workspace</span>
        <h1>Percentage Calculator</h1>
        <p className="subtitle">Calculate percent-of, ratio percentage, and percentage change with denominator context.</p>

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
          <a className="button button-outline" href="/tools/percentage-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Percentage inputs</h2>
              <p className="tool-description">Choose percent-of, ratio, or change mode and enter the matching values.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="percentage-mode">
              Calculation mode
              <select className="input" id="percentage-mode" onChange={(event) => updateMode(event.target.value)} value={plan.mode}>
                <option value="percentOf">Percent of</option>
                <option value="ratio">Ratio percentage</option>
                <option value="change">Percentage change</option>
              </select>
            </label>

            {plan.mode === "percentOf" ? (
              <>
                <label className="field-label" htmlFor="percentage-percent">
                  Percent
                  <input className="input" id="percentage-percent" onChange={(event) => updateNumber("percent", event.target.value)} step="0.1" type="number" value={plan.percent} />
                </label>
                <label className="field-label" htmlFor="percentage-base">
                  Base value
                  <input className="input" id="percentage-base" onChange={(event) => updateNumber("baseValue", event.target.value)} step="0.01" type="number" value={plan.baseValue} />
                </label>
              </>
            ) : null}

            {plan.mode === "ratio" ? (
              <>
                <label className="field-label" htmlFor="percentage-part">
                  Part value
                  <input className="input" id="percentage-part" onChange={(event) => updateNumber("partValue", event.target.value)} step="0.01" type="number" value={plan.partValue} />
                </label>
                <label className="field-label" htmlFor="percentage-whole">
                  Whole value
                  <input className="input" id="percentage-whole" onChange={(event) => updateNumber("wholeValue", event.target.value)} step="0.01" type="number" value={plan.wholeValue} />
                </label>
              </>
            ) : null}

            {plan.mode === "change" ? (
              <>
                <label className="field-label" htmlFor="percentage-from">
                  Starting value
                  <input className="input" id="percentage-from" onChange={(event) => updateNumber("fromValue", event.target.value)} step="0.01" type="number" value={plan.fromValue} />
                </label>
                <label className="field-label" htmlFor="percentage-to">
                  Ending value
                  <input className="input" id="percentage-to" onChange={(event) => updateNumber("toValue", event.target.value)} step="0.01" type="number" value={plan.toValue} />
                </label>
              </>
            ) : null}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save percentage
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate percentage
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Percentage summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see result and formula context."}</p>
            </div>
            <span className="badge local">{result?.direction ?? "Percent"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedResult ?? "0"}</strong>
              <span>Result</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.modeLabel ?? percentageModeLabels[plan.mode]}</strong>
              <span>Mode</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.directionLabel ?? "-"}</strong>
              <span>Direction</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? "Checked" : "-"}</strong>
              <span>Denominator</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Percent size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formulaNote ?? "Waiting for calculation"}</strong>
              <small>{result?.denominatorNote ?? "Calculate first to review denominator context."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Denominator notes</h2>
        <div className="remediation-list">
          {denominatorNotes.map((item, index) => (
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
          <p>Percentage math runs locally and should be labeled with its denominator before reuse.</p>
        </div>
      </aside>
    </div>
  );
}
