"use client";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { apyCompoundingOptions, calculateApy, defaultApyScenario, type ApyInput, type ApyResult } from "@/lib/tools/apy-calculator";

const trustRows = [
  ["Local", "APR, compounding, and principal assumptions stay in this browser session", "local"],
  ["Reference", "APY compares yield before taxes, fees, and withdrawal rules", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const apyNotes = [
  "VitalCalc APY formula is (1 + r / n)^n - 1.",
  "Higher compounding frequency increases effective yield, but differences can be small.",
  "Compare APY together with fees, minimums, liquidity, and account rules."
];

export function ApyCalculatorWorkspace() {
  const [plan, setPlan] = useState<ApyInput>(defaultApyScenario);
  const [result, setResult] = useState<ApyResult | null>(null);

  const calculate = () => {
    setResult(calculateApy(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.apy-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof ApyInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="apy-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>APY Calculator</h1>
        <p className="subtitle">Convert stated APR into effective APY and compare compounding frequencies.</p>

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
          <a className="button button-outline" href="/tools/apy-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>APY inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust APR, compounding periods, and principal.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="apy-apr">
              Interest rate APR
              <input className="input" id="apy-apr" min={0} onChange={(event) => updateNumber("aprPercent", event.target.value)} step="0.01" type="number" value={plan.aprPercent} />
            </label>
            <label className="field-label" htmlFor="apy-periods">
              Compounding periods
              <input className="input" id="apy-periods" min={1} onChange={(event) => updateNumber("compoundingPeriods", event.target.value)} type="number" value={plan.compoundingPeriods} />
            </label>
            <label className="field-label" htmlFor="apy-principal">
              Principal
              <input className="input" id="apy-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} type="number" value={plan.principal} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save APY plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate APY
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Yield summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to convert APR into effective yield."}</p>
            </div>
            <span className="badge warn">Effective yield</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedApy ?? "0.00%"}</strong>
              <span>APY</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedApr ?? "0.00%"}</strong>
              <span>APR</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedYearEndBalance ?? "$0"}</strong>
              <span>Year-end balance</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInterestEarned ?? "$0"}</strong>
              <span>Interest earned</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? "Compounding comparison ready" : "Waiting for calculation"}</strong>
              <small>
                {result
                  ? result.comparisonRows.map((row) => `${row.frequency}: ${row.formattedApy}`).join(" / ")
                  : apyCompoundingOptions.map((option) => option.frequency).join(" / ")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>APY notes</h2>
        <div className="remediation-list">
          {apyNotes.map((item, index) => (
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
          <p>No bank account data is required. Use APY as a comparison aid, not a product recommendation.</p>
        </div>
      </aside>
    </div>
  );
}
