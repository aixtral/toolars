"use client";
import { useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateMortgageRefinance,
  defaultMortgageRefinanceScenario,
  type MortgageRefinanceInput,
  type MortgageRefinanceResult
} from "@/lib/tools/mortgage-refinance-calculator";

const trustRows = [
  ["Local", "Loan balance, rates, terms, and costs stay in this browser session", "local"],
  ["Scenario", "Break-even math assumes payment savings are realized every month", "warn"],
  ["Private", "Save only stores the refinance case locally when you choose it", ""]
] as const;

const refinanceNotes = [
  "VitalCalc compares old and new fixed-rate payments using the same balance.",
  "Total interest saved is net of the entered refinancing cost.",
  "Prepayment penalties, points, closing-cost financing, taxes, and holding period can change the decision."
];

export function MortgageRefinanceCalculatorWorkspace() {
  const t = useTranslations("tools.mortgage-refinance-calculator");
  const [plan, setPlan] = useState<MortgageRefinanceInput>(defaultMortgageRefinanceScenario);
  const [result, setResult] = useState<MortgageRefinanceResult | null>(null);

  const calculate = () => {
    setResult(calculateMortgageRefinance(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.mortgage-refinance-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof MortgageRefinanceInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="mortgage-refinance-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc refinance workspace</span>
        <h1>Mortgage Refinance Calculator</h1>
        <p className="subtitle">Compare current and new mortgage terms, monthly savings, and break-even time.</p>

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
          <a className="button button-outline" href="/tools/mortgage-refinance-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Refinance inputs</h2>
              <p className="tool-description">Compare current balance, old terms, new terms, and refinance costs.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="refi-balance">
              Current loan balance
              <input className="input" id="refi-balance" min={0} onChange={(event) => updateNumber("currentBalance", event.target.value)} step="1000" type="number" value={plan.currentBalance} />
            </label>
            <label className="field-label" htmlFor="refi-current-rate">
              Current interest rate
              <input className="input" id="refi-current-rate" min={0} onChange={(event) => updateNumber("currentAnnualInterestRate", event.target.value)} step="0.05" type="number" value={plan.currentAnnualInterestRate} />
            </label>
            <label className="field-label" htmlFor="refi-current-years">
              Remaining term
              <select className="input" id="refi-current-years" onChange={(event) => updateNumber("currentRemainingYears", event.target.value)} value={plan.currentRemainingYears}>
                <option value={5}>5 years</option>
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </label>
            <label className="field-label" htmlFor="refi-new-rate">
              New interest rate
              <input className="input" id="refi-new-rate" min={0} onChange={(event) => updateNumber("newAnnualInterestRate", event.target.value)} step="0.05" type="number" value={plan.newAnnualInterestRate} />
            </label>
            <label className="field-label" htmlFor="refi-new-years">
              New loan term
              <select className="input" id="refi-new-years" onChange={(event) => updateNumber("newLoanTermYears", event.target.value)} value={plan.newLoanTermYears}>
                <option value={5}>5 years</option>
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </label>
            <label className="field-label" htmlFor="refi-cost">
              Refinancing costs
              <input className="input" id="refi-cost" min={0} onChange={(event) => updateNumber("refinancingCost", event.target.value)} step="1000" type="number" value={plan.refinancingCost} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save refinance case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate refinance savings
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Refinance summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate savings and break-even time."}</p>
            </div>
            <span className={`badge ${result?.statusTone === "worthwhile" ? "local" : "warn"}`}>{result?.statusTitle ?? "Refi"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySavings ?? "$0"}</strong>
              <span>Monthly savings</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOldMonthly ?? "$0"}</strong>
              <span>Old payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNewMonthly ?? "$0"}</strong>
              <span>New payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.breakEvenLabel ?? "--"}</strong>
              <span>Break-even</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalInterestSaved ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.guidance} Current interest ${result.formattedOldInterest}; new interest ${result.formattedNewInterest}.` : "Calculate first to review net interest saved after costs."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Refinance notes</h2>
        <div className="remediation-list">
          {refinanceNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Refinance caveat
          </strong>
          <p>Compare loan estimates from multiple lenders and confirm how long you expect to keep the property.</p>
        </div>
      </aside>
    </div>
  );
}
