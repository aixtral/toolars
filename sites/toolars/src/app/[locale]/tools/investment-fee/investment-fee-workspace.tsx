"use client";

import { Calculator, Save, ShieldCheck, TrendingDown } from "lucide-react";
import { useState } from "react";
import {
  calculateInvestmentFee,
  defaultInvestmentFeeScenario,
  type InvestmentFeeInput,
  type InvestmentFeeResult
} from "@/lib/tools/investment-fee";

const trustRows = [
  ["Local", "Investment assumptions stay in this browser session", "local"],
  ["No advice", "Fee drag math is not fund selection or investment advice", "warn"],
  ["Private", "Save only stores the scenario locally when you choose it", ""]
] as const;

const feeNotes = [
  "VitalCalc compares the same investment path with and without annual management fees.",
  "The model subtracts the fee from annual return before monthly compounding.",
  "Real returns, expense ratios, taxes, loads, and trading fees can change outcomes."
];

export function InvestmentFeeWorkspace() {
  const [plan, setPlan] = useState<InvestmentFeeInput>(defaultInvestmentFeeScenario);
  const [result, setResult] = useState<InvestmentFeeResult | null>(null);

  const calculate = () => {
    setResult(calculateInvestmentFee(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.investment-fee.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InvestmentFeeInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="investment-fee">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc fee-drag workspace</span>
        <h1>Investment Fee Calculator</h1>
        <p className="subtitle">Compare long-term growth before and after annual management fees.</p>

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
          <a className="button button-outline" href="/tools/investment-fee/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fee drag inputs</h2>
              <p className="tool-description">Use starting amount, monthly contribution, return, period, and annual fee.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="fee-initial">
              Initial investment
              <input className="input" id="fee-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} step="1" type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="fee-monthly">
              Monthly contribution
              <input className="input" id="fee-monthly" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} step="1" type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="fee-return">
              Expected annual return
              <input className="input" id="fee-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="fee-years">
              Investment period
              <input className="input" id="fee-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="fee-rate">
              Annual management fee
              <input className="input" id="fee-rate" min={0} onChange={(event) => updateNumber("annualFee", event.target.value)} step="0.05" type="number" value={plan.annualFee} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save fee scenario
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate fee impact
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fee impact summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see long-term fee drag."}</p>
            </div>
            <span className={`badge ${result?.feeTone === "high" ? "warn" : "local"}`}>{result ? result.feeTone : "Fees"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFeeDrag ?? "$0"}</strong>
              <span>Total fees eroded</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNoFeeValue ?? "$0"}</strong>
              <span>Without fees</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWithFeeValue ?? "$0"}</strong>
              <span>With fees</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFeeAsEndValue ?? "0.0%"}</strong>
              <span>Fee as end value</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingDown size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalInvested ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedFeeAsInvested} of total invested; real return ${result.formattedRealAnnualReturn}.` : "Calculate first to compare fee and no-fee paths."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Fee context notes</h2>
        <div className="remediation-list">
          {feeNotes.map((item, index) => (
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
          <p>Use the output as scenario math; compare official expense ratios and disclosures before investing.</p>
        </div>
      </aside>
    </div>
  );
}
