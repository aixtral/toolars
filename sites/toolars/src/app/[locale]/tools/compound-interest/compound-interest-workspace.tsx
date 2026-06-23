"use client";
import { useTranslations } from "next-intl";

import { Calculator, Download, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  calculateCompoundInterest,
  defaultCompoundInterestScenario,
  type CompoundInterestInput,
  type CompoundInterestResult
} from "@/lib/tools/compound-interest";

const trustRows = [
  ["Local", "Investment assumptions stay in this browser session", "local"],
  ["Risk", "Projected returns are not guaranteed", "warn"],
  ["Export", "Save assumptions with date and return caveats", ""]
] as const;

const investmentNotes = [
  "Monthly compounding follows the VitalCalc source formula.",
  "Long-term returns can vary widely by asset mix, fees, taxes, and sequence risk.",
  "Use nominal projections as planning estimates, not investment advice."
];

export function CompoundInterestWorkspace() {
  const t = useTranslations("tools.compound-interest");
  const [plan, setPlan] = useState<CompoundInterestInput>(defaultCompoundInterestScenario);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);

  const calculate = () => {
    setResult(calculateCompoundInterest(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.compound-interest.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CompoundInterestInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="compound-interest">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Compound Interest Calculator</h1>
        <p className="subtitle">Model investment growth with monthly contributions and monthly compounding.</p>

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
          <a className="button button-outline" href="/tools/compound-interest/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Investment inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust initial balance, contribution, return, and years.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="compound-initial">
              Initial investment
              <input className="input" id="compound-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="compound-contribution">
              Monthly contribution
              <input className="input" id="compound-contribution" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="compound-return">
              Annual return
              <input className="input" id="compound-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
            <label className="field-label" htmlFor="compound-years">
              Years
              <input className="input" id="compound-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} type="number" value={plan.years} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate growth
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Growth summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to project future value and interest earned."}</p>
            </div>
            <button className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> Export table
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFutureValue ?? "$0"}</strong>
              <span>Future value</span>
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
              <strong>{result ? String(result.yearlyRows.length) : "0"}</strong>
              <span>Year rows</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? "Monthly compounding projection" : "Waiting for calculation"}</strong>
              <small>
                {result
                  ? `Year 1 balance ${result.firstYear.formattedBalance} with ${result.firstYear.formattedInterestEarned} interest`
                  : "Calculate first to see year-one growth."}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Investment notes</h2>
        <div className="remediation-list">
          {investmentNotes.map((item, index) => (
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
          <p>No brokerage, account, or tax data is required for this projection prototype.</p>
        </div>
      </aside>
    </div>
  );
}
