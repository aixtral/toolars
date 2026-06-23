"use client";
import { useTranslations } from "next-intl";

import { Calculator, PiggyBank, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateEmergencyFund,
  defaultEmergencyFundScenario,
  emergencyCoverageOptions,
  emergencyTimelineOptions,
  type EmergencyFundInput,
  type EmergencyFundResult
} from "@/lib/tools/emergency-fund";

const trustRows = [
  ["Local", "Expense and savings assumptions stay in this browser session", "local"],
  ["Reference", "Coverage months are planning targets, not guarantees", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const emergencyNotes = [
  "VitalCalc source recommends 3-6 months for many single earners and 6-12 months for families.",
  "Keep emergency funds liquid and separate from long-term investments.",
  "Use essential monthly expenses, not total lifestyle spending, for the base target."
];

export function EmergencyFundWorkspace() {
  const t = useTranslations("tools.emergency-fund");
  const [plan, setPlan] = useState<EmergencyFundInput>(defaultEmergencyFundScenario);
  const [result, setResult] = useState<EmergencyFundResult | null>(null);

  const calculate = () => {
    setResult(calculateEmergencyFund(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.emergency-fund.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof EmergencyFundInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="emergency-fund">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Emergency Fund Calculator</h1>
        <p className="subtitle">Estimate a cash buffer from monthly expenses, target coverage, current savings, and timeline.</p>

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
          <a className="button button-outline" href="/tools/emergency-fund/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Emergency inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust coverage and timeline.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="emergency-expenses">
              Monthly expenses
              <input className="input" id="emergency-expenses" min={0} onChange={(event) => updateNumber("monthlyExpenses", event.target.value)} type="number" value={plan.monthlyExpenses} />
            </label>
            <label className="field-label" htmlFor="emergency-coverage">
              Coverage months
              <select className="input" id="emergency-coverage" onChange={(event) => updateNumber("coverageMonths", event.target.value)} value={plan.coverageMonths}>
                {emergencyCoverageOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="emergency-savings">
              Current emergency savings
              <input className="input" id="emergency-savings" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="emergency-timeline">
              Time to reach goal
              <select className="input" id="emergency-timeline" onChange={(event) => updateNumber("targetTimelineMonths", event.target.value)} value={plan.targetTimelineMonths}>
                {emergencyTimelineOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save fund plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate fund
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fund target</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate target, gap, and monthly savings."}</p>
            </div>
            <span className="badge warn">Planning</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTarget ?? "$0"}</strong>
              <span>Emergency target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGap ?? "$0"}</strong>
              <span>Savings gap</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySavingsNeeded ?? "$0"}</strong>
              <span>Monthly needed</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.progressPercent.toFixed(1)}%` : "0%"}</strong>
              <span>Current progress</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PiggyBank size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `Savings progress ${result.progressLabel}` : "Waiting for calculation"}</strong>
              <small>{result ? "Use a dedicated high-liquidity account for this buffer." : "Calculate first to see the coverage gap."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Emergency notes</h2>
        <div className="remediation-list">
          {emergencyNotes.map((item, index) => (
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
          <p>No bank account or income data is required. Results are planning estimates.</p>
        </div>
      </aside>
    </div>
  );
}
