"use client";

import { Calculator, Download, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateLoanPayment,
  defaultLoanScenario,
  type LoanInput,
  type LoanResult
} from "@/lib/tools/loan-calculator";

const trustRows = [
  ["Local", "Loan assumptions stay in this browser session", "local"],
  ["APR", "Compare APR, fees, and prepayment terms before choosing a loan", "warn"],
  ["Export", "Save payment assumptions with the calculation date", ""]
] as const;

const amortizationNotes = [
  "Monthly payment uses the standard fixed-rate amortization formula.",
  "Total interest changes quickly when rate or term changes.",
  "Early payoff decisions should account for prepayment penalties and opportunity cost."
];

export function LoanCalculatorWorkspace() {
  const [scenario, setScenario] = useState<LoanInput>(defaultLoanScenario);
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculate = () => {
    setResult(calculateLoanPayment(scenario));
  };

  const saveScenario = () => {
    window.localStorage.setItem("toolars.loan-calculator.scenario", JSON.stringify(scenario));
  };

  const updateNumber = (key: keyof LoanInput, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="loan-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Loan Calculator</h1>
        <p className="subtitle">Calculate fixed-rate loan payments, total borrowing cost, and first-year amortization locally.</p>

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
          <a className="button button-outline" href="/tools/loan-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Loan terms</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust principal, APR, and term.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="loan-principal">
              Loan amount
              <input className="input" id="loan-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} type="number" value={scenario.principal} />
            </label>
            <label className="field-label" htmlFor="loan-rate">
              APR
              <input className="input" id="loan-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={scenario.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="loan-term">
              Term years
              <input className="input" id="loan-term" min={1} onChange={(event) => updateNumber("termYears", event.target.value)} type="number" value={scenario.termYears} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveScenario} type="button">
              <Save size={16} aria-hidden="true" /> Save assumptions
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate loan
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Payment summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate monthly payment and total interest."}</p>
            </div>
            <button className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> Export plan
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>Monthly payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>Total interest</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalRepayment ?? "$0"}</strong>
              <span>Total repayment</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.paymentCount) : "0"}</strong>
              <span>Payments</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Calculator size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>
                {result
                  ? `Year 1 principal ${result.firstYear.formattedPrincipalPaid} + interest ${result.firstYear.formattedInterestPaid}`
                  : "Calculate first to see first-year amortization."}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Amortization notes</h2>
        <div className="remediation-list">
          {amortizationNotes.map((item, index) => (
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
          <p>No credit profile or lender data is required. Use results as planning estimates.</p>
        </div>
      </aside>
    </div>
  );
}
