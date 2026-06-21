"use client";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateFire,
  defaultFireScenario,
  type FireInput,
  type FireResult
} from "@/lib/tools/fire-calculator";

const trustRows = [
  ["Local", "Income, spending, and portfolio assumptions stay in this browser session", "local"],
  ["No advice", "FIRE math is long-range scenario planning, not investment advice", "warn"],
  ["Private", "Save only stores the FIRE plan locally when you choose it", ""]
] as const;

const fireNotes = [
  "VitalCalc uses the 4% rule shortcut: annual expenses times 25.",
  "Years to FIRE are projected with a yearly loop: balance grows by return, then annual savings are added.",
  "Taxes, health care, sequence risk, market returns, and lifestyle changes can materially alter the outcome."
];

export function FireCalculatorWorkspace() {
  const [plan, setPlan] = useState<FireInput>(defaultFireScenario);
  const [result, setResult] = useState<FireResult | null>(null);

  const calculate = () => {
    setResult(calculateFire(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.fire-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof FireInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="fire-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc FIRE workspace</span>
        <h1>FIRE Calculator</h1>
        <p className="subtitle">Estimate your financial independence number and the years needed to reach it.</p>

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
          <a className="button button-outline" href="/tools/fire-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>FIRE inputs</h2>
              <p className="tool-description">Use annual expenses, annual income, current net worth, and return assumption.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="fire-expenses">
              Annual expenses
              <input className="input" id="fire-expenses" min={0} onChange={(event) => updateNumber("annualExpenses", event.target.value)} step="1000" type="number" value={plan.annualExpenses} />
            </label>
            <label className="field-label" htmlFor="fire-income">
              Annual income
              <input className="input" id="fire-income" min={0} onChange={(event) => updateNumber("annualIncome", event.target.value)} step="1000" type="number" value={plan.annualIncome} />
            </label>
            <label className="field-label" htmlFor="fire-net-worth">
              Current net worth
              <input className="input" id="fire-net-worth" min={0} onChange={(event) => updateNumber("currentNetWorth", event.target.value)} step="1000" type="number" value={plan.currentNetWorth} />
            </label>
            <label className="field-label" htmlFor="fire-return">
              Annual return rate
              <input className="input" id="fire-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save FIRE plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate FIRE
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>FIRE summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see your FIRE number and runway."}</p>
            </div>
            <span className={`badge ${result?.guidanceTone === "blocked" ? "warn" : "local"}`}>{result?.guidanceTone ?? "FIRE"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFireNumber ?? "$0"}</strong>
              <span>FIRE number</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSavingsRate ?? "0.0%"}</strong>
              <span>Savings rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedYearsToFire ?? "0 years"}</strong>
              <span>Years to FIRE</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualSavings ?? "$0"}</strong>
              <span>Annual savings</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedProjectedBalance ?? "Waiting for calculation"}</strong>
              <small>{result?.guidance ?? "Calculate first to review the yearly projection."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>No-advice notes</h2>
        <div className="remediation-list">
          {fireNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Scenario caveat
          </strong>
          <p>Use the output as planning math and review assumptions before changing savings or retirement plans.</p>
        </div>
      </aside>
    </div>
  );
}
