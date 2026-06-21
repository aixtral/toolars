"use client";

import { Calculator, Save, ShieldCheck, WalletCards } from "lucide-react";
import { useState } from "react";
import {
  calculateSocialInsurance,
  defaultSocialInsuranceScenario,
  type SocialInsuranceInput,
  type SocialInsuranceResult
} from "@/lib/tools/social-insurance-calculator";

const trustRows = [
  ["Local", "Salary and contribution assumptions stay in this browser session", "local"],
  ["Policy", "City rules and employer policy can change actual payroll", "warn"],
  ["Private", "Save only stores the payroll case locally when you choose it", ""]
] as const;

const policyNotes = [
  "VitalCalc clamps the contribution base between optional local min and max limits.",
  "Employee contributions include pension, medical, unemployment, and housing fund.",
  "Work injury and maternity are employer-only in this model; local payroll policy may vary."
];

export function SocialInsuranceCalculatorWorkspace() {
  const [plan, setPlan] = useState<SocialInsuranceInput>(defaultSocialInsuranceScenario);
  const [result, setResult] = useState<SocialInsuranceResult | null>(null);

  const calculate = () => {
    setResult(calculateSocialInsurance(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.social-insurance-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof SocialInsuranceInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: value === "" ? undefined : Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="social-insurance-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc payroll workspace</span>
        <h1>China Social Insurance Calculator</h1>
        <p className="subtitle">Estimate five-insurances, housing fund, individual tax, employer cost, and net salary.</p>

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
          <a className="button button-outline" href="/tools/social-insurance-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Salary assumptions</h2>
              <p className="tool-description">Use salary, housing fund rate, and optional local contribution base limits.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="social-salary">
              Monthly pre-tax salary
              <input className="input" id="social-salary" min={0} onChange={(event) => updateNumber("salary", event.target.value)} step="100" type="number" value={plan.salary} />
            </label>
            <label className="field-label" htmlFor="social-housing-rate">
              Housing fund rate
              <select className="input" id="social-housing-rate" onChange={(event) => updateNumber("housingFundRate", event.target.value)} value={plan.housingFundRate}>
                <option value={0.05}>5%</option>
                <option value={0.07}>7%</option>
                <option value={0.08}>8%</option>
                <option value={0.1}>10%</option>
                <option value={0.12}>12%</option>
              </select>
            </label>
            <label className="field-label" htmlFor="social-base-min">
              Contribution base min
              <input className="input" id="social-base-min" min={0} onChange={(event) => updateNumber("baseMin", event.target.value)} placeholder="Auto" step="100" type="number" value={plan.baseMin ?? ""} />
            </label>
            <label className="field-label" htmlFor="social-base-max">
              Contribution base max
              <input className="input" id="social-base-max" min={0} onChange={(event) => updateNumber("baseMax", event.target.value)} placeholder="Auto" step="100" type="number" value={plan.baseMax ?? ""} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save payroll case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate contributions
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Contribution summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to review payroll deductions and employer contributions."}</p>
            </div>
            <span className={`badge ${result?.contributionTone === "high" ? "warn" : "local"}`}>{result?.contributionTone ?? "Payroll"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNetSalary ?? "¥0"}</strong>
              <span>Net salary</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEmployeeContribution ?? "¥0"}</strong>
              <span>Employee contribution</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEmployerContribution ?? "¥0"}</strong>
              <span>Employer contribution</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTax ?? "¥0"}</strong>
              <span>Individual income tax</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <WalletCards size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedHousingFundDeposit ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedContributionBase} contribution base; housing fund includes employee plus employer portions.` : "Calculate first to review the housing fund deposit."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Policy notes</h2>
        <div className="remediation-list">
          {policyNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Policy caveat
          </strong>
          <p>Check local base limits, employer policy, and payroll rules before making a salary decision.</p>
        </div>
      </aside>
    </div>
  );
}
