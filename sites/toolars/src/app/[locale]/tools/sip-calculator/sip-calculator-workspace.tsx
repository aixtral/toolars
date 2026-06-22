"use client";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { calculateSipReturns, defaultSipScenario, type SipInput, type SipResult } from "@/lib/tools/sip-calculator";

const trustRows = [
  ["Local", "SIP contribution and return assumptions stay in this browser session", "local"],
  ["Estimate", "Projected return is a planning assumption, not a guarantee", "warn"],
  ["Private", "Save only stores the local SIP plan when you choose it", ""]
] as const;

const sipNotes = [
  "VitalCalc SIP uses monthly contributions and a monthly rate derived from annual return.",
  "Zero-return scenarios are handled as straight contributions plus initial principal.",
  "Real fund returns vary with fees, taxes, currency, and sequence of market returns."
];

export function SipCalculatorWorkspace() {
  const [plan, setPlan] = useState<SipInput>(() => defaultSipScenario);
  const [result, setResult] = useState<SipResult | null>(null);

  const calculate = () => {
    setResult(calculateSipReturns(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.sip-calculator.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof SipInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="sip-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc fund workspace</span>
        <h1>Fund SIP Calculator</h1>
        <p className="subtitle">Project monthly systematic investment plan contributions, total invested amount, and estimated returns.</p>

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
          <a className="button button-outline" href="/tools/sip-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>SIP inputs</h2>
              <p className="tool-description">Use monthly investment, annual return, years, and optional initial principal.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="sip-monthly">
              Monthly investment
              <input className="input" id="sip-monthly" min={0} onChange={(event) => updateNumber("monthlyInvestment", event.target.value)} type="number" value={plan.monthlyInvestment} />
            </label>
            <label className="field-label" htmlFor="sip-return">
              Annual return
              <input className="input" id="sip-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="sip-years">
              Years
              <input className="input" id="sip-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="sip-principal">
              Initial principal
              <input className="input" id="sip-principal" min={0} onChange={(event) => updateNumber("initialPrincipal", event.target.value)} type="number" value={plan.initialPrincipal} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save SIP plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate SIP returns
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>SIP summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see future value, invested principal, and return rate."}</p>
            </div>
            <span className="badge local">{result ? "Projection" : "SIP"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalValue ?? "$0"}</strong>
              <span>Total value</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInvested ?? "$0"}</strong>
              <span>Total invested</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReturnRate ?? "0.0%"}</strong>
              <span>Return rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInvestmentReturns ?? "$0"}</strong>
              <span>Investment returns</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `${result.schedule.length} yearly rows` : "Waiting for calculation"}</strong>
              <small>{result ? "Yearly rows track contributions and projected year-end value." : "Calculate first to review the SIP projection."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>SIP notes</h2>
        <div className="remediation-list">
          {sipNotes.map((item, index) => (
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
          <p>SIP projections are browser-only planning math and do not connect to fund accounts.</p>
        </div>
      </aside>
    </div>
  );
}
