"use client";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateHourlyToSalary,
  defaultHourlyToSalaryScenario,
  type HourlyToSalaryInput,
  type HourlyToSalaryResult
} from "@/lib/tools/hourly-to-salary";

const trustRows = [
  ["Local", "Wage and schedule assumptions stay in this browser session", "local"],
  ["Gross", "Results are before taxes, benefits, deductions, and bonuses", "warn"],
  ["Private", "Save only stores the salary scenario locally when you choose it", ""]
] as const;

const salaryNotes = [
  "VitalCalc annual salary equals hourly rate times weekly hours times paid weeks.",
  "Overtime adds overtime hours times multiplier times hourly rate for each paid week.",
  "Compare gross pay with taxes, benefits, unpaid time, and local labor rules before deciding."
];

export function HourlyToSalaryWorkspace() {
  const [plan, setPlan] = useState<HourlyToSalaryInput>(defaultHourlyToSalaryScenario);
  const [result, setResult] = useState<HourlyToSalaryResult | null>(null);

  const calculate = () => {
    setResult(calculateHourlyToSalary(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.hourly-to-salary.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof HourlyToSalaryInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="hourly-to-salary">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc income workspace</span>
        <h1>Hourly to Salary Calculator</h1>
        <p className="subtitle">Convert hourly wage into annual, monthly, and weekly gross pay with overtime assumptions.</p>

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
          <a className="button button-outline" href="/tools/hourly-to-salary/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Wage inputs</h2>
              <p className="tool-description">Use hourly rate, schedule, paid weeks, and overtime multiplier.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="salary-rate">
              Hourly rate
              <input className="input" id="salary-rate" min={0} onChange={(event) => updateNumber("hourlyRate", event.target.value)} step="0.01" type="number" value={plan.hourlyRate} />
            </label>
            <label className="field-label" htmlFor="salary-hours">
              Hours per week
              <input className="input" id="salary-hours" min={0} onChange={(event) => updateNumber("hoursPerWeek", event.target.value)} step="0.1" type="number" value={plan.hoursPerWeek} />
            </label>
            <label className="field-label" htmlFor="salary-weeks">
              Weeks per year
              <input className="input" id="salary-weeks" min={1} onChange={(event) => updateNumber("weeksPerYear", event.target.value)} step="0.1" type="number" value={plan.weeksPerYear} />
            </label>
            <label className="field-label" htmlFor="salary-overtime-hours">
              Overtime hours
              <input className="input" id="salary-overtime-hours" min={0} onChange={(event) => updateNumber("overtimeHoursPerWeek", event.target.value)} step="0.1" type="number" value={plan.overtimeHoursPerWeek} />
            </label>
            <label className="field-label" htmlFor="salary-overtime-multiplier">
              Overtime multiplier
              <select className="input" id="salary-overtime-multiplier" onChange={(event) => updateNumber("overtimeMultiplier", event.target.value)} value={plan.overtimeMultiplier}>
                <option value={1}>None</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save salary
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate salary
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Salary estimate</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate annual, monthly, and weekly gross pay."}</p>
            </div>
            <span className="badge local">{result ? "Gross pay" : "Pay"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAnnualSalary ?? "$0"}</strong>
              <span>Annual salary</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySalary ?? "$0"}</strong>
              <span>Monthly salary</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWeeklySalary ?? "$0"}</strong>
              <span>Weekly salary</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOvertimePay ?? "$0"}</strong>
              <span>Overtime pay</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? "This is gross pay before tax and benefit adjustments." : "Calculate first to review the wage conversion assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Gross pay notes</h2>
        <div className="remediation-list">
          {salaryNotes.map((item, index) => (
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
          <p>Pay assumptions are calculated locally and are not saved unless you choose Save.</p>
        </div>
      </aside>
    </div>
  );
}
