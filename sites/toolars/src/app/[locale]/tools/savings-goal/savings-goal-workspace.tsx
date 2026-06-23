"use client";
import { useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import {
  calculateSavingsGoal,
  defaultSavingsGoalScenario,
  type SavingsGoalInput,
  type SavingsGoalResult
} from "@/lib/tools/savings-goal";

const trustRows = [
  ["Local", "Goal, savings, and return assumptions stay in this browser session", "local"],
  ["Reference", "Returns are projections and can be zero or variable", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const savingsNotes = [
  "VitalCalc models fixed monthly contributions at month-end.",
  "The source caps long timelines at 600 months and labels them as 50+ years.",
  "For near-term goals, consider lower-risk cash or bond-like assumptions."
];

export function SavingsGoalWorkspace() {
  const t = useTranslations("tools.savings-goal");
  const [plan, setPlan] = useState<SavingsGoalInput>(defaultSavingsGoalScenario);
  const [result, setResult] = useState<SavingsGoalResult | null>(null);

  const calculate = () => {
    setResult(calculateSavingsGoal(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.savings-goal.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof SavingsGoalInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="savings-goal">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Savings Goal Calculator</h1>
        <p className="subtitle">Estimate how long a fixed monthly savings plan takes to reach a target.</p>

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
          <a className="button button-outline" href="/tools/savings-goal/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Savings inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust the target, current balance, monthly savings, and return.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="savings-goal-amount">
              Goal amount
              <input className="input" id="savings-goal-amount" min={0} onChange={(event) => updateNumber("goalAmount", event.target.value)} type="number" value={plan.goalAmount} />
            </label>
            <label className="field-label" htmlFor="savings-goal-saved">
              Current savings
              <input className="input" id="savings-goal-saved" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="savings-goal-monthly">
              Monthly savings
              <input className="input" id="savings-goal-monthly" min={0} onChange={(event) => updateNumber("monthlySavings", event.target.value)} type="number" value={plan.monthlySavings} />
            </label>
            <label className="field-label" htmlFor="savings-goal-rate">
              Annual return
              <input className="input" id="savings-goal-rate" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save savings plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate goal
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Goal timeline</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate months, contributions, and growth."}</p>
            </div>
            <span className="badge warn">Projection</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.timeLabel ?? "0 months"}</strong>
              <span>Time to goal</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalContributions ?? "$0"}</strong>
              <span>Total contributions</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInterestEarned ?? "$0"}</strong>
              <span>Interest earned</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFinalAmount ?? "$0"}</strong>
              <span>Final amount</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `Target ${result.formattedGoalAmount}` : "Waiting for calculation"}</strong>
              <small>{result ? "Adjust monthly savings or return assumptions to test feasibility." : "Calculate first to see the savings horizon."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Savings notes</h2>
        <div className="remediation-list">
          {savingsNotes.map((item, index) => (
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
          <p>No account balances leave the browser. Outputs are planning estimates.</p>
        </div>
      </aside>
    </div>
  );
}
