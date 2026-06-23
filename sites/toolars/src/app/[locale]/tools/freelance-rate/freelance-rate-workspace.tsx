"use client";
import { useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TimerReset } from "lucide-react";
import { useState } from "react";
import {
  calculateFreelanceRate,
  defaultFreelanceRateScenario,
  type FreelanceRateInput,
  type FreelanceRateResult
} from "@/lib/tools/freelance-rate";

const trustRows = [
  ["Local", "Income targets and costs stay in this browser session", "local"],
  ["Pricing", "Rate output is a floor, not a market guarantee", "warn"],
  ["Private", "Save only stores the rate plan locally when you choose it", ""]
] as const;

const pricingNotes = [
  "VitalCalc divides the revenue target by actual billable hours, not total work hours.",
  "Revenue target includes target income, estimated taxes, insurance, operating costs, and location factor.",
  "Project quotes should add scope risk, revisions, platform fees, and client acquisition cost."
];

export function FreelanceRateWorkspace() {
  const t = useTranslations("tools.freelance-rate");
  const [plan, setPlan] = useState<FreelanceRateInput>(defaultFreelanceRateScenario);
  const [result, setResult] = useState<FreelanceRateResult | null>(null);

  const calculate = () => {
    setResult(calculateFreelanceRate(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.freelance-rate.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof FreelanceRateInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="freelance-rate">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc rate-floor workspace</span>
        <h1>Freelance Rate Calculator</h1>
        <p className="subtitle">Price hourly, daily, and project work from income goals, costs, and real billable time.</p>

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
          <a className="button button-outline" href="/tools/freelance-rate/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Rate inputs</h2>
              <p className="tool-description">Use target income, unpaid time, tax, insurance, costs, and location factor.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="freelance-income">
              Target annual income
              <input className="input" id="freelance-income" min={0} onChange={(event) => updateNumber("goalIncome", event.target.value)} step="1000" type="number" value={plan.goalIncome} />
            </label>
            <label className="field-label" htmlFor="freelance-vacation">
              Paid vacation days
              <input className="input" id="freelance-vacation" min={0} onChange={(event) => updateNumber("vacationDays", event.target.value)} step="1" type="number" value={plan.vacationDays} />
            </label>
            <label className="field-label" htmlFor="freelance-hours">
              Weekly work hours
              <input className="input" id="freelance-hours" min={0} onChange={(event) => updateNumber("weeklyWorkHours", event.target.value)} step="1" type="number" value={plan.weeklyWorkHours} />
            </label>
            <label className="field-label" htmlFor="freelance-nonbillable">
              Non-billable time
              <select className="input" id="freelance-nonbillable" onChange={(event) => updateNumber("nonBillableRatio", event.target.value)} value={plan.nonBillableRatio}>
                <option value={0.2}>20% stable</option>
                <option value={0.3}>30% normal</option>
                <option value={0.4}>40% heavy</option>
                <option value={0.5}>50% transition</option>
              </select>
            </label>
            <label className="field-label" htmlFor="freelance-tax">
              Combined tax rate
              <input className="input" id="freelance-tax" min={0} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
            </label>
            <label className="field-label" htmlFor="freelance-insurance">
              Insurance annual cost
              <input className="input" id="freelance-insurance" min={0} onChange={(event) => updateNumber("insuranceCost", event.target.value)} step="100" type="number" value={plan.insuranceCost} />
            </label>
            <label className="field-label" htmlFor="freelance-ops">
              Operating cost
              <input className="input" id="freelance-ops" min={0} onChange={(event) => updateNumber("operatingCost", event.target.value)} step="100" type="number" value={plan.operatingCost} />
            </label>
            <label className="field-label" htmlFor="freelance-location">
              Location factor
              <select className="input" id="freelance-location" onChange={(event) => updateNumber("locationFactor", event.target.value)} value={plan.locationFactor}>
                <option value={1}>Remote 1.0x</option>
                <option value={1.2}>Tier 2 1.2x</option>
                <option value={1.4}>Tier 1 1.4x</option>
                <option value={1.8}>Intl 1.8x</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save rate plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate rate floor
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Rate floor summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to convert annual targets into billable rates."}</p>
            </div>
            <span className={`badge ${result?.rateTone === "high" ? "warn" : "local"}`}>{result?.rateTone ?? "Rate"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedHourlyRate ?? "¥0"}</strong>
              <span>Minimum hourly rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDailyRate ?? "¥0"}</strong>
              <span>Daily rate at 8 hours</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProjectRate ?? "¥0"}</strong>
              <span>Project rate at 40 hours</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPremiumRate ?? "¥0"}</strong>
              <span>Suggested rate plus margin</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TimerReset size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedBillableHours ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedNonBillableHours} non-billable from ${result.formattedTotalWorkHours} total work time.` : "Calculate first to review utilization."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Pricing notes</h2>
        <div className="remediation-list">
          {pricingNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Pricing caveat
          </strong>
          <p>Use the output as a floor; real proposals need market checks, scope control, and tax review.</p>
        </div>
      </aside>
    </div>
  );
}
