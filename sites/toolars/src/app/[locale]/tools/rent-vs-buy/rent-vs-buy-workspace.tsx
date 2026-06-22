"use client";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateRentVsBuy,
  defaultRentVsBuyScenario,
  type RentVsBuyInput,
  type RentVsBuyResult
} from "@/lib/tools/rent-vs-buy";

const trustRows = [
  ["Local", "Housing assumptions stay in this browser session", "local"],
  ["Scenario", "Outputs depend on simplified rent, mortgage, and return assumptions", "warn"],
  ["Private", "Save only stores the housing case locally when you choose it", ""]
] as const;

const housingNotes = [
  "VitalCalc compares buying cost against rent plus opportunity cost on the down payment.",
  "This model uses the analysis period as the mortgage amortization window, matching the source calculator.",
  "Local taxes, home appreciation, selling costs, moving flexibility, and liquidity can change the decision."
];

export function RentVsBuyWorkspace() {
  const [plan, setPlan] = useState<RentVsBuyInput>(defaultRentVsBuyScenario);
  const [result, setResult] = useState<RentVsBuyResult | null>(null);

  const calculate = () => {
    setResult(calculateRentVsBuy(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.rent-vs-buy.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RentVsBuyInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="rent-vs-buy">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc housing comparison</span>
        <h1>Rent vs Buy Calculator</h1>
        <p className="subtitle">Compare a buying scenario against rent and invested down-payment opportunity cost.</p>

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
          <a className="button button-outline" href="/tools/rent-vs-buy/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Housing comparison inputs</h2>
              <p className="tool-description">Use buy, rent, return, and analysis-period assumptions.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="rentbuy-home-price">
              Home price
              <input className="input" id="rentbuy-home-price" min={0} onChange={(event) => updateNumber("homePrice", event.target.value)} step="1000" type="number" value={plan.homePrice} />
            </label>
            <label className="field-label" htmlFor="rentbuy-down">
              Down payment percent
              <input className="input" id="rentbuy-down" min={0} onChange={(event) => updateNumber("downPaymentPercent", event.target.value)} step="1" type="number" value={plan.downPaymentPercent} />
            </label>
            <label className="field-label" htmlFor="rentbuy-rate">
              Mortgage rate
              <input className="input" id="rentbuy-rate" min={0} onChange={(event) => updateNumber("mortgageRate", event.target.value)} step="0.1" type="number" value={plan.mortgageRate} />
            </label>
            <label className="field-label" htmlFor="rentbuy-holding">
              Annual holding cost
              <input className="input" id="rentbuy-holding" min={0} onChange={(event) => updateNumber("annualHoldingCost", event.target.value)} step="500" type="number" value={plan.annualHoldingCost} />
            </label>
            <label className="field-label" htmlFor="rentbuy-rent">
              Monthly rent
              <input className="input" id="rentbuy-rent" min={0} onChange={(event) => updateNumber("monthlyRent", event.target.value)} step="100" type="number" value={plan.monthlyRent} />
            </label>
            <label className="field-label" htmlFor="rentbuy-return">
              Down payment return
              <input className="input" id="rentbuy-return" min={0} onChange={(event) => updateNumber("investmentReturn", event.target.value)} step="0.1" type="number" value={plan.investmentReturn} />
            </label>
            <label className="field-label" htmlFor="rentbuy-years">
              Analysis period
              <input className="input" id="rentbuy-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save housing case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Compare rent vs buy
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Decision summary</h2>
              <p className="tool-description">{result ? result.summary : "Run comparison to review buy versus rent costs."}</p>
            </div>
            <span className={`badge ${result?.recommendation === "rent" ? "warn" : "local"}`}>{result?.recommendation ?? "Compare"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.recommendationTitle ?? "Not calculated"}</strong>
              <span>Recommendation</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBuyingCost ?? "$0"}</strong>
              <span>Total buying cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRentingCost ?? "$0"}</strong>
              <span>Total renting cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyMortgage ?? "$0/mo"}</strong>
              <span>Monthly mortgage</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedOpportunityCost ?? "Waiting for comparison"}</strong>
              <small>{result ? `${result.formattedDifference} cost gap across ${plan.years} years.` : "Compare first to review down-payment opportunity cost."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Housing notes</h2>
        <div className="remediation-list">
          {housingNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Housing caveat
          </strong>
          <p>Use the output as scenario math; validate taxes, fees, appreciation, liquidity, and lifestyle needs.</p>
        </div>
      </aside>
    </div>
  );
}
