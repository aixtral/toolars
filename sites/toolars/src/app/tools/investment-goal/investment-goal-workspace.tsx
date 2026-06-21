"use client";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import {
  calculateInvestmentGoal,
  defaultInvestmentGoalScenario,
  type InvestmentGoalInput,
  type InvestmentGoalResult
} from "@/lib/tools/investment-goal";

const trustRows = [
  ["Local", "Goal, balance, return, and timeline stay in this browser session", "local"],
  ["No guarantee", "Market returns are assumptions, not promised outcomes", "warn"],
  ["Private", "Save only stores the goal plan locally when you choose it", ""]
] as const;

const marketNotes = [
  "VitalCalc uses the future value of an annuity formula to solve required monthly investment.",
  "Starting balance is compounded first, then the remaining goal gap is funded monthly.",
  "Returns, fees, taxes, and contribution timing can make real-world results differ."
];

export function InvestmentGoalWorkspace() {
  const [plan, setPlan] = useState<InvestmentGoalInput>(defaultInvestmentGoalScenario);
  const [result, setResult] = useState<InvestmentGoalResult | null>(null);

  const calculate = () => {
    setResult(calculateInvestmentGoal(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.investment-goal.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InvestmentGoalInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="investment-goal">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc goal-planning workspace</span>
        <h1>Investment Goal Calculator</h1>
        <p className="subtitle">Estimate the monthly investment needed to reach a target amount.</p>

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
          <a className="button button-outline" href="/tools/investment-goal/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Goal inputs</h2>
              <p className="tool-description">Use goal amount, starting balance, expected return, and timeline.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="goal-amount">
              Goal amount
              <input className="input" id="goal-amount" min={0} onChange={(event) => updateNumber("goalAmount", event.target.value)} step="1" type="number" value={plan.goalAmount} />
            </label>
            <label className="field-label" htmlFor="goal-start">
              Starting balance
              <input className="input" id="goal-start" min={0} onChange={(event) => updateNumber("startingBalance", event.target.value)} step="1" type="number" value={plan.startingBalance} />
            </label>
            <label className="field-label" htmlFor="goal-return">
              Annual return
              <input className="input" id="goal-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="goal-years">
              Years to goal
              <input className="input" id="goal-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save goal plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate monthly investment
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Monthly investment summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see required monthly investment."}</p>
            </div>
            <span className="badge local">{result?.goalStatus ?? "Goal"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyInvestment ?? "$0"}</strong>
              <span>Monthly investment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInvested ?? "$0"}</strong>
              <span>Total invested</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedStartingBalanceGrowth ?? "$0"}</strong>
              <span>Starting balance growth</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGoalGap ?? "$0"}</strong>
              <span>Goal gap</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedGoalAmount ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedStartingBalance} starting balance over ${plan.years} years.` : "Calculate first to review the monthly plan."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Market assumption notes</h2>
        <div className="remediation-list">
          {marketNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> No guarantee
          </strong>
          <p>Use this as planning math only; update assumptions as fees, taxes, income, and market returns change.</p>
        </div>
      </aside>
    </div>
  );
}
