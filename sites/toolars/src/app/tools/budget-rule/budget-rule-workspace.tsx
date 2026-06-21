"use client";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateBudgetRule,
  defaultBudgetRuleScenario,
  type BudgetRuleInput,
  type BudgetRuleResult
} from "@/lib/tools/budget-rule";

const trustRows = [
  ["Local", "Income and allocation ratios stay in this browser session", "local"],
  ["Reference", "50/30/20 is a budgeting heuristic, not a mandate", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const budgetNotes = [
  "VitalCalc splits income into needs, wants, and savings by percentage.",
  "Adjust ratios when rent, debt payoff, or savings priorities require it.",
  "A ratio total outside 100% needs review before using the allocation."
];

export function BudgetRuleWorkspace() {
  const [plan, setPlan] = useState<BudgetRuleInput>(defaultBudgetRuleScenario);
  const [result, setResult] = useState<BudgetRuleResult | null>(null);

  const calculate = () => {
    setResult(calculateBudgetRule(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.budget-rule.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof BudgetRuleInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="budget-rule">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>50/30/20 Budget Rule</h1>
        <p className="subtitle">Split monthly income into needs, wants, and savings using adjustable ratios.</p>

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
          <a className="button button-outline" href="/tools/budget-rule/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Budget inputs</h2>
              <p className="tool-description">Use the VitalCalc 50/30/20 sample or tune percentages for the household.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="budget-income">
              Monthly income
              <input className="input" id="budget-income" min={0} onChange={(event) => updateNumber("monthlyIncome", event.target.value)} type="number" value={plan.monthlyIncome} />
            </label>
            <label className="field-label" htmlFor="budget-needs">
              Needs percent
              <input className="input" id="budget-needs" min={0} onChange={(event) => updateNumber("needsPercent", event.target.value)} type="number" value={plan.needsPercent} />
            </label>
            <label className="field-label" htmlFor="budget-wants">
              Wants percent
              <input className="input" id="budget-wants" min={0} onChange={(event) => updateNumber("wantsPercent", event.target.value)} type="number" value={plan.wantsPercent} />
            </label>
            <label className="field-label" htmlFor="budget-savings">
              Savings percent
              <input className="input" id="budget-savings" min={0} onChange={(event) => updateNumber("savingsPercent", event.target.value)} type="number" value={plan.savingsPercent} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save budget
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Generate budget
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Budget allocation</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to split income into three buckets."}</p>
            </div>
            <span className={`badge ${result?.healthTone === "warning" ? "warn" : "local"}`}>{result ? `${result.totalPercent}% total` : "Budget"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedIncome ?? "$0"}</strong>
              <span>Monthly income</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNeedsAmount ?? "$0"}</strong>
              <span>Needs</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWantsAmount ?? "$0"}</strong>
              <span>Wants</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSavingsAmount ?? "$0"}</strong>
              <span>Savings</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result?.message ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use this as a monthly envelope before transaction-level tracking." : "Calculate first to review the allocation health."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Budget notes</h2>
        <div className="remediation-list">
          {budgetNotes.map((item, index) => (
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
          <p>No payroll or transaction data is required. This is a local allocation planner.</p>
        </div>
      </aside>
    </div>
  );
}
