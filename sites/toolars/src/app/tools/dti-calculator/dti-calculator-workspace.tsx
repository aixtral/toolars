"use client";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateDti, defaultDtiScenario, type DtiInput, type DtiResult } from "@/lib/tools/dti-calculator";

const trustRows = [
  ["Local", "Income and payment assumptions stay in this browser session", "local"],
  ["Reference", "Mortgage DTI thresholds vary by lender and loan type", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const dtiNotes = [
  "VitalCalc front-end DTI is housing payments divided by gross monthly income.",
  "Back-end DTI includes housing plus recurring monthly debt payments.",
  "Many lenders prefer back-end DTI at or below 36%, while some programs may allow more."
];

export function DtiCalculatorWorkspace() {
  const [plan, setPlan] = useState<DtiInput>(defaultDtiScenario);
  const [result, setResult] = useState<DtiResult | null>(null);

  const calculate = () => {
    setResult(calculateDti(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.dti-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof DtiInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="dti-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Debt-to-Income Calculator</h1>
        <p className="subtitle">Calculate front-end and back-end DTI for mortgage readiness and debt health.</p>

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
          <a className="button button-outline" href="/tools/dti-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>DTI inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust monthly income and debt payments.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="dti-income">
              Gross monthly income
              <input className="input" id="dti-income" min={0} onChange={(event) => updateNumber("grossMonthlyIncome", event.target.value)} type="number" value={plan.grossMonthlyIncome} />
            </label>
            <label className="field-label" htmlFor="dti-mortgage">
              Estimated mortgage payment
              <input className="input" id="dti-mortgage" min={0} onChange={(event) => updateNumber("mortgagePayment", event.target.value)} type="number" value={plan.mortgagePayment} />
            </label>
            <label className="field-label" htmlFor="dti-debt">
              Other monthly debt
              <input className="input" id="dti-debt" min={0} onChange={(event) => updateNumber("otherMonthlyDebt", event.target.value)} type="number" value={plan.otherMonthlyDebt} />
            </label>
            <label className="field-label" htmlFor="dti-housing">
              Property tax / insurance / HOA
              <input className="input" id="dti-housing" min={0} onChange={(event) => updateNumber("housingAddOns", event.target.value)} type="number" value={plan.housingAddOns} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save DTI plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate DTI
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>DTI summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate mortgage and total debt ratios."}</p>
            </div>
            <span className={`badge ${result?.healthTone === "high" ? "warn" : "local"}`}>{result?.healthTone === "high" ? "High DTI" : "Ratio"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? `${result.backEndDtiPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>Back-end DTI</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.frontEndDtiPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>Front-end DTI</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalMonthlyPayments ?? "$0"}</strong>
              <span>Total monthly payments</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDisposableIncome ?? "$0"}</strong>
              <span>Disposable income</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.qualifyMessage ?? "Waiting for calculation"}</strong>
              <small>{result ? "Compare with lender thresholds before applying." : "Calculate first to see loan readiness guidance."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>DTI notes</h2>
        <div className="remediation-list">
          {dtiNotes.map((item, index) => (
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
          <p>No lender or credit file is connected. Ratios are calculated only from local inputs.</p>
        </div>
      </aside>
    </div>
  );
}
