"use client";
import { useTranslations } from "next-intl";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateHomeAffordability,
  defaultHomeAffordabilityScenario,
  type HomeAffordabilityInput,
  type HomeAffordabilityResult
} from "@/lib/tools/home-affordability-calculator";

const trustRows = [
  ["Local", "Income, debt, and mortgage assumptions stay in this browser session", "local"],
  ["Scenario", "Affordability math uses simplified DTI and mortgage payment assumptions", "warn"],
  ["Private", "Save only stores the housing case locally when you choose it", ""]
] as const;

const readinessNotes = [
  "VitalCalc reverses the fixed-rate mortgage formula from the selected monthly payment ceiling.",
  "The 28/36 rule is a lender rule of thumb, not a purchase approval decision.",
  "Taxes, insurance, HOA fees, closing costs, maintenance, and local policy can materially change the budget."
];

export function HomeAffordabilityCalculatorWorkspace() {
  const t = useTranslations("tools.home-affordability-calculator");
  const [plan, setPlan] = useState<HomeAffordabilityInput>(defaultHomeAffordabilityScenario);
  const [result, setResult] = useState<HomeAffordabilityResult | null>(null);

  const calculate = () => {
    setResult(calculateHomeAffordability(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.home-affordability-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof HomeAffordabilityInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="home-affordability-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc affordability workspace</span>
        <h1>Home Affordability Calculator</h1>
        <p className="subtitle">Reverse a mortgage payment ceiling into an estimated affordable home price.</p>

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
          <a className="button button-outline" href="/tools/home-affordability-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Affordability inputs</h2>
              <p className="tool-description">Use income, debt, DTI limit, down payment, rate, and term.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="home-affordability-income">
              Monthly household income
              <input className="input" id="home-affordability-income" min={0} onChange={(event) => updateNumber("monthlyHouseholdIncome", event.target.value)} step="100" type="number" value={plan.monthlyHouseholdIncome} />
            </label>
            <label className="field-label" htmlFor="home-affordability-debt">
              Existing monthly debt
              <input className="input" id="home-affordability-debt" min={0} onChange={(event) => updateNumber("existingMonthlyDebt", event.target.value)} step="100" type="number" value={plan.existingMonthlyDebt} />
            </label>
            <label className="field-label" htmlFor="home-affordability-down">
              Down payment ratio
              <select className="input" id="home-affordability-down" onChange={(event) => updateNumber("downPaymentRatio", event.target.value)} value={plan.downPaymentRatio}>
                <option value={0.15}>15%</option>
                <option value={0.2}>20%</option>
                <option value={0.3}>30% recommended</option>
                <option value={0.4}>40%</option>
                <option value={0.5}>50%</option>
              </select>
            </label>
            <label className="field-label" htmlFor="home-affordability-rate">
              Mortgage interest rate
              <input className="input" id="home-affordability-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.05" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="home-affordability-term">
              Loan term
              <select className="input" id="home-affordability-term" onChange={(event) => updateNumber("loanTermYears", event.target.value)} value={plan.loanTermYears}>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </label>
            <label className="field-label" htmlFor="home-affordability-dti">
              Debt-to-income limit
              <select className="input" id="home-affordability-dti" onChange={(event) => updateNumber("dtiLimit", event.target.value)} value={plan.dtiLimit}>
                <option value={0.28}>28% conservative</option>
                <option value={0.35}>35% moderate</option>
                <option value={0.4}>40% flexible</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save affordability case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate affordability
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Affordability summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate price, monthly payment, and DTI."}</p>
            </div>
            <span className={`badge ${result?.statusTone === "healthy" ? "local" : "warn"}`}>{result?.statusTone ?? "Housing"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMaxPrice ?? "¥0"}</strong>
              <span>Max affordable price</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "¥0"}</strong>
              <span>Monthly payment ceiling</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoanAmount ?? "¥0"}</strong>
              <span>Loan amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDtiRatio ?? "--"}</strong>
              <span>Total DTI ratio</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.statusTitle ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedDownPayment} estimated down payment. ${result.guidance}` : "Calculate first to review affordability guidance."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Mortgage readiness notes</h2>
        <div className="remediation-list">
          {readinessNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Housing caveat
          </strong>
          <p>Use this as scenario math and validate lender, tax, insurance, and liquidity assumptions separately.</p>
        </div>
      </aside>
    </div>
  );
}
