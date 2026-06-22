"use client";

import { Calculator, Save, ShieldCheck, SunMedium } from "lucide-react";
import { useState } from "react";
import {
  calculateCoastFire,
  defaultCoastFireScenario,
  type CoastFireInput,
  type CoastFireResult
} from "@/lib/tools/coast-fire";

const trustRows = [
  ["Local", "Age, assets, and expenses stay in this browser session", "local"],
  ["No advice", "Coast FIRE is scenario math, not a retirement recommendation", "warn"],
  ["Private", "Save only stores the coast plan locally when you choose it", ""]
] as const;

const coastNotes = [
  "Traditional FIRE target equals annual expenses divided by withdrawal rate.",
  "Coast FIRE target discounts that future target back by expected compound return.",
  "Inflation, taxes, portfolio risk, withdrawal rate, and retirement age changes can shift the target."
];

export function CoastFireWorkspace() {
  const [plan, setPlan] = useState<CoastFireInput>(defaultCoastFireScenario);
  const [result, setResult] = useState<CoastFireResult | null>(null);

  const calculate = () => {
    setResult(calculateCoastFire(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.coast-fire.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CoastFireInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="coast-fire">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc coast checkpoint</span>
        <h1>Coast FIRE Calculator</h1>
        <p className="subtitle">Check whether your current assets can compound to a future FIRE target without more saving.</p>

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
          <a className="button button-outline" href="/tools/coast-fire/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Coast FIRE inputs</h2>
              <p className="tool-description">Use ages, assets, expenses, return, and withdrawal rate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="coast-current-age">
              Current age
              <input className="input" id="coast-current-age" min={0} onChange={(event) => updateNumber("currentAge", event.target.value)} step="1" type="number" value={plan.currentAge} />
            </label>
            <label className="field-label" htmlFor="coast-retirement-age">
              Retirement age
              <input className="input" id="coast-retirement-age" min={0} onChange={(event) => updateNumber("retirementAge", event.target.value)} step="1" type="number" value={plan.retirementAge} />
            </label>
            <label className="field-label" htmlFor="coast-assets">
              Current assets
              <input className="input" id="coast-assets" min={0} onChange={(event) => updateNumber("currentAssets", event.target.value)} step="1000" type="number" value={plan.currentAssets} />
            </label>
            <label className="field-label" htmlFor="coast-expenses">
              Annual expenses
              <input className="input" id="coast-expenses" min={0} onChange={(event) => updateNumber("annualExpenses", event.target.value)} step="1000" type="number" value={plan.annualExpenses} />
            </label>
            <label className="field-label" htmlFor="coast-return">
              Expected annual return
              <input className="input" id="coast-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="coast-withdrawal">
              Safe withdrawal rate
              <input className="input" id="coast-withdrawal" min={0.1} onChange={(event) => updateNumber("withdrawalRate", event.target.value)} step="0.1" type="number" value={plan.withdrawalRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save coast plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate Coast FIRE
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Coast checkpoint</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to compare current assets with the coast target."}</p>
            </div>
            <span className={`badge ${result?.statusTone === "gap" ? "warn" : "local"}`}>{result?.statusTone ?? "Coast"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFireTarget ?? "$0"}</strong>
              <span>Traditional FIRE target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCoastTarget ?? "$0"}</strong>
              <span>Coast FIRE target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProgress ?? "0.0%"}</strong>
              <span>Progress</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGapOrSurplus ?? "$0"}</strong>
              <span>Gap or surplus</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <SunMedium size={18} aria-hidden="true" />
            <span>
              <strong>{result?.statusTitle ?? "Waiting for calculation"}</strong>
              <small>{result?.statusText ?? "Calculate first to review the coast checkpoint."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Compounding notes</h2>
        <div className="remediation-list">
          {coastNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Retirement caveat
          </strong>
          <p>Validate the assumptions with a financial planner before reducing or stopping retirement contributions.</p>
        </div>
      </aside>
    </div>
  );
}
