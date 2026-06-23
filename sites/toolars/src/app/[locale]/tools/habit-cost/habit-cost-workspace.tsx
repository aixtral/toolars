"use client";
import { useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateHabitCost,
  defaultHabitCostScenario,
  type HabitCostInput,
  type HabitCostResult
} from "@/lib/tools/habit-cost";

const trustRows = [
  ["Local", "Habit cost and return assumptions stay in this browser session", "local"],
  ["Reflection", "Outputs are behavior-cost math, not a judgment or recommendation", "warn"],
  ["Private", "Save only stores the habit scenario locally when you choose it", ""]
] as const;

const reflectionNotes = [
  "VitalCalc weekly spend equals cost per occurrence times frequency per week.",
  "Future value uses an ordinary annuity model from the monthly equivalent cost.",
  "Habits can carry social, health, or quality-of-life value beyond pure financial math."
];

export function HabitCostWorkspace() {
  const t = useTranslations("tools.habit-cost");
  const [plan, setPlan] = useState<HabitCostInput>(defaultHabitCostScenario);
  const [result, setResult] = useState<HabitCostResult | null>(null);

  const calculate = () => {
    setResult(calculateHabitCost(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.habit-cost.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof HabitCostInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="habit-cost">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc opportunity cost workspace</span>
        <h1>Habit Cost Calculator</h1>
        <p className="subtitle">Estimate repeated spending, future value, and opportunity cost for a daily or weekly habit.</p>

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
          <a className="button button-outline" href="/tools/habit-cost/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Habit inputs</h2>
              <p className="tool-description">Use cost, weekly frequency, timeline, and return assumption.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="habit-cost-per">
              Cost per occurrence
              <input className="input" id="habit-cost-per" min={0} onChange={(event) => updateNumber("costPerOccurrence", event.target.value)} step="0.01" type="number" value={plan.costPerOccurrence} />
            </label>
            <label className="field-label" htmlFor="habit-frequency">
              Frequency per week
              <input className="input" id="habit-frequency" min={0} onChange={(event) => updateNumber("frequencyPerWeek", event.target.value)} step="0.1" type="number" value={plan.frequencyPerWeek} />
            </label>
            <label className="field-label" htmlFor="habit-years">
              Years
              <input className="input" id="habit-years" min={0} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="habit-return">
              Annual return rate
              <input className="input" id="habit-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save habit plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate habit cost
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Opportunity cost summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see total spending and possible investment value."}</p>
            </div>
            <span className="badge local">{result ? "Opportunity" : "Habit"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFutureValue ?? "$0"}</strong>
              <span>Future value</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalSpent ?? "$0"}</strong>
              <span>Total spent</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInvestmentGain ?? "$0"}</strong>
              <span>Investment gain</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWeeklyCost ?? "$0"}</strong>
              <span>Weekly cost</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? "Opportunity cost equals future value minus total spent." : "Calculate first to review repeated spending assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Reflection notes</h2>
        <div className="remediation-list">
          {reflectionNotes.map((item, index) => (
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
          <p>Habit assumptions are private local math until you choose to save them.</p>
        </div>
      </aside>
    </div>
  );
}
