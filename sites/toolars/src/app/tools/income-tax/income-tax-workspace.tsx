"use client";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateIncomeTax,
  defaultIncomeTaxScenario,
  type IncomeTaxInput,
  type IncomeTaxResult
} from "@/lib/tools/income-tax";

const trustRows = [
  ["Local", "Income, deduction, and rate assumptions stay in this browser session", "local"],
  ["No advice", "This is simplified planning math, not filing guidance", "warn"],
  ["Private", "Save only stores the tax scenario locally when you choose it", ""]
] as const;

const taxNotes = [
  "VitalCalc taxable income equals monthly salary minus monthly deduction.",
  "Tax is estimated from a simplified flat rate rather than progressive brackets or credits.",
  "Real tax liability can change with jurisdiction, filing status, credits, and local rules."
];

export function IncomeTaxWorkspace() {
  const [plan, setPlan] = useState<IncomeTaxInput>(defaultIncomeTaxScenario);
  const [result, setResult] = useState<IncomeTaxResult | null>(null);

  const calculate = () => {
    setResult(calculateIncomeTax(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.income-tax.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof IncomeTaxInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="income-tax">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc take-home pay workspace</span>
        <h1>Income Tax Calculator</h1>
        <p className="subtitle">Estimate monthly take-home pay from gross income, deductions, and flat-rate tax assumptions.</p>

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
          <a className="button button-outline" href="/tools/income-tax/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Income inputs</h2>
              <p className="tool-description">Use monthly salary, flat tax rate, deductions, and extra withheld amount.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="tax-salary">
              Monthly salary
              <input className="input" id="tax-salary" min={0} onChange={(event) => updateNumber("monthlySalary", event.target.value)} step="1" type="number" value={plan.monthlySalary} />
            </label>
            <label className="field-label" htmlFor="tax-rate">
              Tax rate
              <input className="input" id="tax-rate" min={0} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
            </label>
            <label className="field-label" htmlFor="tax-deduction">
              Monthly deduction
              <input className="input" id="tax-deduction" min={0} onChange={(event) => updateNumber("monthlyDeduction", event.target.value)} step="1" type="number" value={plan.monthlyDeduction} />
            </label>
            <label className="field-label" htmlFor="tax-extra">
              Extra withheld
              <input className="input" id="tax-extra" min={0} onChange={(event) => updateNumber("extraWithheld", event.target.value)} step="1" type="number" value={plan.extraWithheld} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save tax plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate take-home
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Take-home summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate tax, deductions, and net income."}</p>
            </div>
            <span className="badge local">{result ? "Flat rate" : "Tax"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyNetIncome ?? "$0"}</strong>
              <span>Monthly net income</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyTax ?? "$0"}</strong>
              <span>Monthly tax</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyDeductions ?? "$0"}</strong>
              <span>Deductions</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualNetIncome ?? "$0"}</strong>
              <span>Annual net income</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedEffectiveRate ?? "Waiting for calculation"}</strong>
              <small>{result ? "Effective monthly tax rate on gross salary." : "Calculate first to review the simplified flat-rate estimate."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Tax context notes</h2>
        <div className="remediation-list">
          {taxNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> No advice
          </strong>
          <p>Use this as planning math only; verify tax rules before filing or making payroll decisions.</p>
        </div>
      </aside>
    </div>
  );
}
