"use client";

import { Calculator, Save, ShieldCheck, TrendingDown } from "lucide-react";
import { useState } from "react";
import {
  calculateInflation,
  defaultInflationScenario,
  type InflationInput,
  type InflationResult
} from "@/lib/tools/inflation-calculator";

const trustRows = [
  ["Local", "Amount, rate, and timeline assumptions stay in this browser session", "local"],
  ["Scenario", "Inflation results are estimates, not forecasts", "warn"],
  ["Private", "Save only stores the inflation scenario locally when you choose it", ""]
] as const;

const assumptionNotes = [
  "VitalCalc future purchasing power equals current amount divided by (1 + inflation rate)^years.",
  "Inflation rates vary by country, category, time period, and personal spending basket.",
  "Break-even return is the nominal return needed before fees and taxes to preserve purchasing power."
];

export function InflationCalculatorWorkspace() {
  const [plan, setPlan] = useState<InflationInput>(defaultInflationScenario);
  const [result, setResult] = useState<InflationResult | null>(null);

  const calculate = () => {
    setResult(calculateInflation(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.inflation-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InflationInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="inflation-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc purchasing power workspace</span>
        <h1>Inflation Calculator</h1>
        <p className="subtitle">Estimate how inflation erodes purchasing power over a planning timeline.</p>

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
          <a className="button button-outline" href="/tools/inflation-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Inflation inputs</h2>
              <p className="tool-description">Use current amount, annual inflation rate, and years.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="inflation-amount">
              Current amount
              <input className="input" id="inflation-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="1" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="inflation-rate">
              Annual inflation rate
              <input className="input" id="inflation-rate" min={0} onChange={(event) => updateNumber("annualInflationRate", event.target.value)} step="0.1" type="number" value={plan.annualInflationRate} />
            </label>
            <label className="field-label" htmlFor="inflation-years">
              Years
              <input className="input" id="inflation-years" min={0} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save scenario
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate inflation
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Purchasing power summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see future purchasing power and inflation loss."}</p>
            </div>
            <span className="badge local">{result ? "Purchasing power" : "Scenario"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFuturePurchasingPower ?? "$0"}</strong>
              <span>Future purchasing power</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOriginalAmount ?? "$0"}</strong>
              <span>Original amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCumulativeInflation ?? "0.0%"}</strong>
              <span>Cumulative inflation</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPurchasingPowerLoss ?? "$0"}</strong>
              <span>Purchasing-power loss</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingDown size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedBreakEvenReturn ?? "Waiting for calculation"}</strong>
              <small>{result ? "Nominal break-even return before fees and taxes." : "Calculate first to review purchasing-power assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Assumption notes</h2>
        <div className="remediation-list">
          {assumptionNotes.map((item, index) => (
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
          <p>Inflation scenarios are calculated locally and saved only when you choose Save.</p>
        </div>
      </aside>
    </div>
  );
}
