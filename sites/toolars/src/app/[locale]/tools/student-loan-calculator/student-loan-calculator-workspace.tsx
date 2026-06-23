"use client";
import { useTranslations } from "next-intl";

import { Calculator, GraduationCap, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateStudentLoan,
  defaultStudentLoanScenario,
  type StudentLoanInput,
  type StudentLoanResult
} from "@/lib/tools/student-loan-calculator";

const trustRows = [
  ["Local", "Loan amount, rate, term, and grace period stay in this browser session", "local"],
  ["Estimate", "Repayment output excludes origination fees, subsidies, and income-driven plans", "warn"],
  ["Private", "Save only stores the repayment plan locally when you choose it", ""]
] as const;

const repaymentNotes = [
  "VitalCalc uses the standard fixed-rate amortization formula for monthly repayment.",
  "The grace period label is informational; interest treatment during grace depends on the loan program.",
  "Loan forgiveness, subsidies, tax deductions, and income-based repayment can materially change the plan."
];

export function StudentLoanCalculatorWorkspace() {
  const t = useTranslations("tools.student-loan-calculator");
  const [plan, setPlan] = useState<StudentLoanInput>(defaultStudentLoanScenario);
  const [result, setResult] = useState<StudentLoanResult | null>(null);

  const calculate = () => {
    setResult(calculateStudentLoan(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.student-loan-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof StudentLoanInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="student-loan-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc education-loan workspace</span>
        <h1>Student Loan Calculator</h1>
        <p className="subtitle">Estimate monthly student-loan repayment, total interest, and first-year amortization.</p>

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
          <a className="button button-outline" href="/tools/student-loan-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Repayment inputs</h2>
              <p className="tool-description">Use loan amount, rate, repayment term, and grace period.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="student-loan-amount">
              Loan amount
              <input className="input" id="student-loan-amount" min={0} onChange={(event) => updateNumber("loanAmount", event.target.value)} step="1000" type="number" value={plan.loanAmount} />
            </label>
            <label className="field-label" htmlFor="student-loan-rate">
              Annual interest rate
              <input className="input" id="student-loan-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.01" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="student-loan-term">
              Repayment term
              <select className="input" id="student-loan-term" onChange={(event) => updateNumber("repaymentTermYears", event.target.value)} value={plan.repaymentTermYears}>
                <option value={5}>5 years</option>
                <option value={10}>10 years standard</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
              </select>
            </label>
            <label className="field-label" htmlFor="student-loan-grace">
              Grace period
              <select className="input" id="student-loan-grace" onChange={(event) => updateNumber("graceMonths", event.target.value)} value={plan.graceMonths}>
                <option value={0}>No grace period</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save repayment plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate repayment plan
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Repayment summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate monthly payment and total interest."}</p>
            </div>
            <span className="badge warn">Loan</span>
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
              <strong>{result?.firstYear.formattedEndingBalance ?? "$0"}</strong>
              <span>Year 1 ending balance</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <GraduationCap size={18} aria-hidden="true" />
            <span>
              <strong>{result?.graceLabel ?? "Waiting for calculation"}</strong>
              <small>
                {result
                  ? `Year 1 principal ${result.firstYear.formattedAnnualPrincipal} + interest ${result.firstYear.formattedAnnualInterest}.`
                  : "Calculate first to review the first repayment year."}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Repayment notes</h2>
        <div className="remediation-list">
          {repaymentNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Loan caveat
          </strong>
          <p>Compare lender disclosures, federal protections, and repayment alternatives before choosing a plan.</p>
        </div>
      </aside>
    </div>
  );
}
