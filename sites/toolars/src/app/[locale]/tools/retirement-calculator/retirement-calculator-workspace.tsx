"use client";
import { useTranslations } from "next-intl";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateRetirementPlan,
  defaultRetirementScenario,
  type RetirementInput,
  type RetirementResult
} from "@/lib/tools/retirement-calculator";

const trustRows = [
  ["Local", "Age, savings, and return assumptions stay in this browser session", "local"],
  ["Reference", "4% rule is a simplified retirement planning heuristic", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const retirementNotes = [
  "VitalCalc estimates the target nest egg as annual retirement expenses multiplied by 25.",
  "Projected savings use monthly compounding and fixed month-end contributions.",
  "Taxes, inflation, fees, healthcare, and sequence risk can materially change a retirement plan."
];

export function RetirementCalculatorWorkspace() {
  const t = useTranslations("tools.retirement-calculator");
  const [plan, setPlan] = useState<RetirementInput>(defaultRetirementScenario);
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculate = () => {
    setResult(calculateRetirementPlan(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.retirement-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RetirementInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="retirement-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Retirement Calculator</h1>
        <p className="subtitle">Estimate a retirement target, projected savings, and gap using the 4% rule.</p>

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
          <a className="button button-outline" href="/tools/retirement-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Retirement inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust age, savings, contributions, return, and retirement expenses.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="retirement-current-age">
              Current age
              <input className="input" id="retirement-current-age" min={0} onChange={(event) => updateNumber("currentAge", event.target.value)} type="number" value={plan.currentAge} />
            </label>
            <label className="field-label" htmlFor="retirement-age">
              Retirement age
              <input className="input" id="retirement-age" min={0} onChange={(event) => updateNumber("retirementAge", event.target.value)} type="number" value={plan.retirementAge} />
            </label>
            <label className="field-label" htmlFor="retirement-savings">
              Current savings
              <input className="input" id="retirement-savings" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="retirement-monthly">
              Monthly contribution
              <input className="input" id="retirement-monthly" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="retirement-return">
              Annual return
              <input className="input" id="retirement-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
            <label className="field-label" htmlFor="retirement-expenses">
              Monthly retirement expenses
              <input className="input" id="retirement-expenses" min={0} onChange={(event) => updateNumber("monthlyRetirementExpenses", event.target.value)} type="number" value={plan.monthlyRetirementExpenses} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save retirement plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate retirement
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Retirement outlook</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate the target nest egg and retirement gap."}</p>
            </div>
            <span className="badge warn">4% rule</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNestEggNeeded ?? "$0"}</strong>
              <span>Nest egg needed</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProjectedSavings ?? "$0"}</strong>
              <span>Projected savings</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGapOrSurplus ?? "$0"}</strong>
              <span>Gap / surplus</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.isValidTimeline ? String(result.yearsToRetirement) : "0"}</strong>
              <span>Years to retirement</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>
                {result
                  ? result.isValidTimeline
                    ? `Year 1 balance ${result.firstYear.formattedBalance} with ${result.firstYear.formattedContributions} contributed`
                    : result.warning
                  : "Waiting for calculation"}
              </strong>
              <small>{result?.isValidTimeline ? "Review inflation, fees, and taxes before acting on the projection." : "Calculate first to see the first-year projection."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Retirement notes</h2>
        <div className="remediation-list">
          {retirementNotes.map((item, index) => (
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
          <p>No brokerage or retirement account data is required for this planning projection.</p>
        </div>
      </aside>
    </div>
  );
}
