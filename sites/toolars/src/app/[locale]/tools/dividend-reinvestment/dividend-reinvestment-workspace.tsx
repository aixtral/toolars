"use client";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  calculateDividendReinvestment,
  defaultDividendReinvestmentScenario,
  type DividendReinvestmentInput,
  type DividendReinvestmentResult
} from "@/lib/tools/dividend-reinvestment";

const trustRows = [
  ["Local", "DRIP assumptions stay in this browser session", "local"],
  ["Estimate", "Dividend yield, stock growth, and tax rate are planning assumptions", "warn"],
  ["Private", "Save only stores the local DRIP plan when you choose it", ""]
] as const;

const dividendNotes = [
  "VitalCalc compounds price growth and reinvests after-tax dividends each period.",
  "The no-reinvest comparison grows share value separately and accumulates after-tax dividend cash.",
  "Actual dividend yields, tax treatment, fees, and price returns can vary materially."
];

export function DividendReinvestmentWorkspace() {
  const [plan, setPlan] = useState<DividendReinvestmentInput>(() => defaultDividendReinvestmentScenario);
  const [result, setResult] = useState<DividendReinvestmentResult | null>(null);

  const calculate = () => {
    setResult(calculateDividendReinvestment(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.dividend-reinvestment.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof DividendReinvestmentInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="dividend-reinvestment">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc DRIP workspace</span>
        <h1>Dividend Reinvestment Calculator</h1>
        <p className="subtitle">Compare reinvested dividends with a no-reinvestment path over a long-term holding period.</p>

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
          <a className="button button-outline" href="/tools/dividend-reinvestment/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>DRIP inputs</h2>
              <p className="tool-description">Use initial investment, yield, growth, holding years, frequency, and tax rate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="drip-initial">
              Initial investment
              <input className="input" id="drip-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="drip-yield">
              Dividend yield
              <input className="input" id="drip-yield" min={0} onChange={(event) => updateNumber("dividendYield", event.target.value)} step="0.1" type="number" value={plan.dividendYield} />
            </label>
            <label className="field-label" htmlFor="drip-growth">
              Stock growth rate
              <input className="input" id="drip-growth" onChange={(event) => updateNumber("stockGrowthRate", event.target.value)} step="0.1" type="number" value={plan.stockGrowthRate} />
            </label>
            <label className="field-label" htmlFor="drip-years">
              Holding years
              <input className="input" id="drip-years" min={1} onChange={(event) => updateNumber("holdingYears", event.target.value)} type="number" value={plan.holdingYears} />
            </label>
            <label className="field-label" htmlFor="drip-frequency">
              Reinvestment frequency
              <input className="input" id="drip-frequency" min={1} onChange={(event) => updateNumber("reinvestmentFrequency", event.target.value)} type="number" value={plan.reinvestmentFrequency} />
            </label>
            <label className="field-label" htmlFor="drip-tax">
              Tax rate
              <input className="input" id="drip-tax" min={0} max={100} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save DRIP plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate DRIP
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>DRIP summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to compare reinvested and no-reinvest outcomes."}</p>
            </div>
            <span className="badge local">{result ? "Projection" : "DRIP"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFinalValue ?? "$0"}</strong>
              <span>Final value</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalDividends ?? "$0"}</strong>
              <span>Total dividends</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReinvestmentAdvantage ?? "$0"}</strong>
              <span>Reinvestment advantage</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNoReinvestValue ?? "$0"}</strong>
              <span>No-reinvest value</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `${result.periods} reinvestment periods` : "Waiting for calculation"}</strong>
              <small>{result ? "Advantage compares after-tax reinvestment with held dividend cash." : "Calculate first to review DRIP compounding."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Dividend notes</h2>
        <div className="remediation-list">
          {dividendNotes.map((item, index) => (
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
          <p>DRIP projections are private local estimates and are not investment advice.</p>
        </div>
      </aside>
    </div>
  );
}
