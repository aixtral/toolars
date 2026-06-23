"use client";
import { useTranslations } from "next-intl";

import { Calculator, Receipt, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateSideIncomeTax,
  defaultSideIncomeTaxScenario,
  type SideIncomeFilingStatus,
  type SideIncomeTaxInput,
  type SideIncomeTaxResult
} from "@/lib/tools/side-income-tax";

const trustRows = [
  ["Local", "Salary and side-income assumptions stay in this browser session", "local"],
  ["Tax estimate", "Outputs are planning math, not filing advice", "warn"],
  ["Private", "Save only stores the tax estimate locally when you choose it", ""]
] as const;

const taxNotes = [
  "VitalCalc applies 15.3% self-employment tax to 92.35% of net side income.",
  "Half of self-employment tax and retirement contributions reduce taxable income in the estimate.",
  "Federal brackets, state tax, deductions, credits, and local rules can change the real filing outcome."
];

export function SideIncomeTaxWorkspace() {
  const t = useTranslations("tools.side-income-tax");
  const [plan, setPlan] = useState<SideIncomeTaxInput>(defaultSideIncomeTaxScenario);
  const [result, setResult] = useState<SideIncomeTaxResult | null>(null);

  const calculate = () => {
    setResult(calculateSideIncomeTax(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.side-income-tax.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Omit<SideIncomeTaxInput, "filingStatus">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateStatus = (value: SideIncomeFilingStatus) => {
    setPlan((current) => ({ ...current, filingStatus: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="side-income-tax">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc side-income workspace</span>
        <h1>Side Income Tax Calculator</h1>
        <p className="subtitle">Estimate self-employment tax, federal plus state tax, and quarterly payments for side work.</p>

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
          <a className="button button-outline" href="/tools/side-income-tax/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Side income inputs</h2>
              <p className="tool-description">Use W-2 salary, gig income, expenses, retirement, filing status, and state rate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="side-salary">
              W-2 salary
              <input className="input" id="side-salary" min={0} onChange={(event) => updateNumber("salary", event.target.value)} step="1000" type="number" value={plan.salary} />
            </label>
            <label className="field-label" htmlFor="side-income">
              Side income
              <input className="input" id="side-income" min={0} onChange={(event) => updateNumber("sideIncome", event.target.value)} step="1000" type="number" value={plan.sideIncome} />
            </label>
            <label className="field-label" htmlFor="side-expenses">
              Business expenses
              <input className="input" id="side-expenses" min={0} onChange={(event) => updateNumber("businessExpenses", event.target.value)} step="500" type="number" value={plan.businessExpenses} />
            </label>
            <label className="field-label" htmlFor="side-retirement">
              Retirement contribution
              <input className="input" id="side-retirement" min={0} onChange={(event) => updateNumber("retirementContribution", event.target.value)} step="500" type="number" value={plan.retirementContribution} />
            </label>
            <label className="field-label" htmlFor="side-status">
              Filing status
              <select className="input" id="side-status" onChange={(event) => updateStatus(event.target.value as SideIncomeFilingStatus)} value={plan.filingStatus}>
                <option value="single">Single</option>
                <option value="mfj">Married filing jointly</option>
                <option value="mfs">Married filing separately</option>
                <option value="hoh">Head of household</option>
              </select>
            </label>
            <label className="field-label" htmlFor="side-state-rate">
              State tax rate
              <input className="input" id="side-state-rate" min={0} onChange={(event) => updateNumber("stateTaxRate", event.target.value)} step="0.5" type="number" value={plan.stateTaxRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save tax estimate
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate side tax
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Tax estimate summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate side-income tax and quarterly payments."}</p>
            </div>
            <span className={`badge ${result?.taxTone === "high" ? "warn" : "local"}`}>{result?.taxTone ?? "Tax"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedSelfEmploymentTax ?? "$0"}</strong>
              <span>Self-employment tax</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFederalAndStateTax ?? "$0"}</strong>
              <span>Federal plus state tax</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEffectiveRate ?? "0.0%"}</strong>
              <span>Effective tax rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedQuarterlyPayment ?? "$0"}</strong>
              <span>Quarterly payment</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Receipt size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTaxableIncome ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedNetSelfEmploymentIncome} net self-employment income after expenses.` : "Calculate first to review taxable income."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Tax planning notes</h2>
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
            <ShieldCheck size={16} aria-hidden="true" /> Tax caveat
          </strong>
          <p>Use official forms or a tax professional before filing or making estimated payments.</p>
        </div>
      </aside>
    </div>
  );
}
