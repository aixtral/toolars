"use client";

import { Calculator, Download, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateMortgagePayment,
  defaultMortgageScenario,
  type MortgageInput,
  type MortgageResult
} from "@/lib/tools/mortgage-calculator";

const trustRows = [
  ["Local", "Inputs stay in this browser session", "local"],
  ["Free", "Core mortgage math is available without sign-in", ""],
  ["Export", "Save assumptions with date and caveats", ""]
] as const;

const affordabilityNotes = [
  "Keep taxes, insurance, and HOA assumptions separate from principal and interest.",
  "Compare at least two rates before using the payment in a budget.",
  "Saved outputs should include rate, term, down payment, and calculation date."
];

export function MortgageCalculatorWorkspace() {
  const [scenario, setScenario] = useState<MortgageInput>(defaultMortgageScenario);
  const [result, setResult] = useState<MortgageResult | null>(null);

  const calculate = () => {
    setResult(calculateMortgagePayment(scenario));
  };

  const saveScenario = () => {
    window.localStorage.setItem("toolars.mortgage-calculator.scenario", JSON.stringify(scenario));
  };

  const updateNumber = (key: keyof MortgageInput, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="mortgage-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Mortgage Calculator</h1>
        <p className="subtitle">
          Calculate monthly mortgage payments, escrow assumptions, and long-term interest locally.
        </p>

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
          <a className="button button-outline" href="/tools/mortgage-calculator/about">Tool details</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Loan inputs</h2>
              <p className="tool-description">Start with the VitalCalc sample, then adjust purchase assumptions.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="mortgage-home-price">
              Home price
              <input
                className="input"
                id="mortgage-home-price"
                min={0}
                onChange={(event) => updateNumber("homePrice", event.target.value)}
                type="number"
                value={scenario.homePrice}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-down-payment">
              Down payment
              <input
                className="input"
                id="mortgage-down-payment"
                min={0}
                onChange={(event) => updateNumber("downPayment", event.target.value)}
                type="number"
                value={scenario.downPayment}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-interest-rate">
              Interest rate
              <input
                className="input"
                id="mortgage-interest-rate"
                min={0}
                onChange={(event) => updateNumber("annualInterestRate", event.target.value)}
                step="0.125"
                type="number"
                value={scenario.annualInterestRate}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-loan-term">
              Loan term
              <input
                className="input"
                id="mortgage-loan-term"
                min={1}
                onChange={(event) => updateNumber("loanTermYears", event.target.value)}
                type="number"
                value={scenario.loanTermYears}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-property-tax">
              Annual property tax
              <input
                className="input"
                id="mortgage-property-tax"
                min={0}
                onChange={(event) => updateNumber("propertyTaxAnnual", event.target.value)}
                type="number"
                value={scenario.propertyTaxAnnual}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-insurance">
              Monthly insurance
              <input
                className="input"
                id="mortgage-insurance"
                min={0}
                onChange={(event) => updateNumber("insuranceMonthly", event.target.value)}
                type="number"
                value={scenario.insuranceMonthly}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveScenario}>
              <Save size={16} aria-hidden="true" /> Save scenario
            </button>
            <button className="button button-solid" type="button" onClick={calculate}>
              <Calculator size={16} aria-hidden="true" /> Calculate payment
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Monthly payment</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate mortgage payment."}</p>
            </div>
            <button className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> Export plan
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>Total monthly payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>Total interest</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.downPaymentPercent}%` : "0%"}</strong>
              <span>Down payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.loanToValuePercent}%` : "0%"}</strong>
              <span>Loan-to-value</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedPrincipalAndInterest} principal and interest with ${result.formattedMonthlyEscrow} escrow.` : "Calculate first to classify the payment plan."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Affordability notes</h2>
        <div className="remediation-list">
          {affordabilityNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong><ShieldCheck size={16} aria-hidden="true" /> Local-first</strong>
          <p>No account data is required for this prototype. Financial assumptions should be reviewed before decisions.</p>
        </div>
      </aside>
    </div>
  );
}
