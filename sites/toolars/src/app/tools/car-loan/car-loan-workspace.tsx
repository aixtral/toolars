"use client";

import { Calculator, Car, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCarLoan,
  defaultCarLoanScenario,
  type CarLoanInput,
  type CarLoanResult
} from "@/lib/tools/car-loan";

const trustRows = [
  ["Local", "Vehicle price and loan terms stay in this browser session", "local"],
  ["Estimate", "Loan output excludes taxes, fees, insurance, and depreciation", "warn"],
  ["Private", "Save only stores the car loan locally when you choose it", ""]
] as const;

const ownershipNotes = [
  "VitalCalc uses the equal-installment loan formula with monthly compounding.",
  "At least 20% down can reduce negative equity risk and total interest.",
  "True ownership cost should also include tax, registration, insurance, maintenance, and depreciation."
];

export function CarLoanWorkspace() {
  const [plan, setPlan] = useState<CarLoanInput>(defaultCarLoanScenario);
  const [result, setResult] = useState<CarLoanResult | null>(null);

  const calculate = () => {
    setResult(calculateCarLoan(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.car-loan.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CarLoanInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="car-loan">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc auto-loan workspace</span>
        <h1>Car Loan Calculator</h1>
        <p className="subtitle">Estimate monthly payment, total interest, and financed vehicle cost.</p>

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
          <a className="button button-outline" href="/tools/car-loan/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Vehicle loan inputs</h2>
              <p className="tool-description">Use vehicle price, down payment, annual rate, and term.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="car-price">
              Vehicle price
              <input className="input" id="car-price" min={0} onChange={(event) => updateNumber("vehiclePrice", event.target.value)} step="500" type="number" value={plan.vehiclePrice} />
            </label>
            <label className="field-label" htmlFor="car-down">
              Down payment percent
              <input className="input" id="car-down" min={0} onChange={(event) => updateNumber("downPaymentPercent", event.target.value)} step="1" type="number" value={plan.downPaymentPercent} />
            </label>
            <label className="field-label" htmlFor="car-rate">
              Annual interest rate
              <input className="input" id="car-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="car-term">
              Loan term
              <select className="input" id="car-term" onChange={(event) => updateNumber("termMonths", event.target.value)} value={plan.termMonths}>
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
                <option value={72}>72 months</option>
                <option value={84}>84 months</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save car loan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate car loan
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Loan cost summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to review monthly payment and total interest."}</p>
            </div>
            <span className={`badge ${result?.interestTone === "high" ? "warn" : "local"}`}>{result?.interestTone ?? "Loan"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>Monthly payment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoanAmount ?? "$0"}</strong>
              <span>Loan amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>Total interest</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTrueCost ?? "$0"}</strong>
              <span>True cost before other fees</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Car size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalPayment ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedDownPayment} down payment plus financed payments.` : "Calculate first to review the full loan cost."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Ownership notes</h2>
        <div className="remediation-list">
          {ownershipNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Ownership caveat
          </strong>
          <p>Compare lender disclosures and total vehicle costs before choosing a loan term.</p>
        </div>
      </aside>
    </div>
  );
}
