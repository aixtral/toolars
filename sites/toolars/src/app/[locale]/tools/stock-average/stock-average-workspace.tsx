"use client";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  calculateStockAverage,
  defaultStockAverageScenario,
  type StockAverageInput,
  type StockAverageResult
} from "@/lib/tools/stock-average";

const trustRows = [
  ["Local", "Purchase lots stay in this browser session", "local"],
  ["No advice", "Cost-basis math is not a buy or sell recommendation", "warn"],
  ["Private", "Save only stores the stock plan locally when you choose it", ""]
] as const;

const costBasisNotes = [
  "VitalCalc average cost equals total cost divided by total shares.",
  "Fees, taxes, currency conversion, corporate actions, and unfilled orders can change real cost basis.",
  "Use brokerage statements for tax reporting and official records."
];

export function StockAverageWorkspace() {
  const [plan, setPlan] = useState<StockAverageInput>(defaultStockAverageScenario);
  const [result, setResult] = useState<StockAverageResult | null>(null);

  const calculate = () => {
    setResult(calculateStockAverage(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.stock-average.plan", JSON.stringify(plan));
  };

  const updateLot = (index: number, key: "shares" | "pricePerShare", value: string) => {
    setPlan((current) => ({
      purchases: current.purchases.map((lot, lotIndex) => (lotIndex === index ? { ...lot, [key]: Number(value) } : lot))
    }));
    setResult(null);
  };

  const addLot = () => {
    setPlan((current) => ({ purchases: [...current.purchases, { shares: 0, pricePerShare: 0 }] }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="stock-average">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc cost basis workspace</span>
        <h1>Stock Average Calculator</h1>
        <p className="subtitle">Calculate average cost per share, total cost basis, and breakeven after multiple purchases.</p>

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
          <a className="button button-outline" href="/tools/stock-average/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Purchase lots</h2>
              <p className="tool-description">Enter shares and price per share for each purchase lot.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="workspace-stack" style={{ gap: 14 }}>
            {plan.purchases.map((lot, index) => (
              <div className="llm-input-grid" key={index}>
                <label className="field-label" htmlFor={`stock-shares-${index}`}>
                  Lot {index + 1} shares
                  <input className="input" id={`stock-shares-${index}`} min={0} onChange={(event) => updateLot(index, "shares", event.target.value)} step="0.01" type="number" value={lot.shares} />
                </label>
                <label className="field-label" htmlFor={`stock-price-${index}`}>
                  Lot {index + 1} price per share
                  <input className="input" id={`stock-price-${index}`} min={0} onChange={(event) => updateLot(index, "pricePerShare", event.target.value)} step="0.01" type="number" value={lot.pricePerShare} />
                </label>
              </div>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={addLot} type="button">
              Add purchase
            </button>
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save stock plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate average
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Cost basis summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see average cost and breakeven price."}</p>
            </div>
            <span className="badge local">{result ? "Cost basis" : "Portfolio"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAveragePrice ?? "$0.00"}</strong>
              <span>Average cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalShares ?? "0"}</strong>
              <span>Total shares</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalCost ?? "$0.00"}</strong>
              <span>Total cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBreakevenPrice ?? "$0.00"}</strong>
              <span>Breakeven</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? "Cost basis excludes fees, taxes, and corporate actions unless included in lot prices." : "Calculate first to review the purchase lots."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Cost-basis notes</h2>
        <div className="remediation-list">
          {costBasisNotes.map((item, index) => (
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
          <p>This workspace is arithmetic only and does not recommend buying, selling, or holding any security.</p>
        </div>
      </aside>
    </div>
  );
}
