"use client";
import { useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  calculateCryptoTax,
  defaultCryptoTaxScenario,
  type CryptoTaxInput,
  type CryptoTaxResult,
  type CryptoTaxTransaction
} from "@/lib/tools/crypto-tax";

const storageKey = "toolars.crypto-tax.transactions:v1";

const trustRows = [
  ["Local", "Transactions stay in this browser session", "local"],
  ["Tax caveat", "PnL math is not legal or tax advice", "warn"],
  ["Private", "Save stores only this sample transaction set locally", ""]
] as const;

const taxNotes = [
  "VitalCalc uses average cost basis: total buy amount divided by total buy quantity.",
  "Realized PnL uses sold quantity times average sell price minus average cost.",
  "Actual crypto taxes can depend on jurisdiction, holding period, fees, lots, transfers, and reporting rules."
];

export function CryptoTaxWorkspace() {
  const t = useTranslations("tools.crypto-tax");
  const [values, setValues] = useState<CryptoTaxInput>(() => defaultCryptoTaxScenario);
  const [result, setResult] = useState<CryptoTaxResult | null>(null);

  const calculate = () => {
    setResult(calculateCryptoTax(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateTransaction = (type: "buyTransactions" | "sellTransactions", index: number, key: keyof CryptoTaxTransaction, value: string) => {
    setValues((current) => ({
      ...current,
      [type]: current[type].map((transaction, transactionIndex) => (transactionIndex === index ? { ...transaction, [key]: Number(value) } : transaction))
    }));
    setResult(null);
  };

  const updateCurrentPrice = (value: string) => {
    setValues((current) => ({ ...current, currentPrice: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="crypto-tax">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc crypto tax workspace</span>
        <h1>Crypto Tax Calculator</h1>
        <p className="subtitle">Estimate average cost basis, realized PnL, and unrealized PnL for a simple crypto position.</p>

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
          <a className="button button-outline" href="/tools/crypto-tax/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Transaction inputs</h2>
              <p className="tool-description">Use the source average-cost model for buys, sells, and current price.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            {values.buyTransactions.map((transaction, index) => (
              <div className="input-pair" key={`buy-${index}`}>
                <label className="field-label" htmlFor={`crypto-buy-${index}-price`}>
                  Buy {index + 1} price
                  <input className="input" id={`crypto-buy-${index}-price`} min={0} onChange={(event) => updateTransaction("buyTransactions", index, "price", event.target.value)} step="0.01" type="number" value={transaction.price} />
                </label>
                <label className="field-label" htmlFor={`crypto-buy-${index}-quantity`}>
                  Buy {index + 1} quantity
                  <input className="input" id={`crypto-buy-${index}-quantity`} min={0} onChange={(event) => updateTransaction("buyTransactions", index, "quantity", event.target.value)} step="0.0001" type="number" value={transaction.quantity} />
                </label>
              </div>
            ))}
            {values.sellTransactions.map((transaction, index) => (
              <div className="input-pair" key={`sell-${index}`}>
                <label className="field-label" htmlFor={`crypto-sell-${index}-price`}>
                  Sell {index + 1} price
                  <input className="input" id={`crypto-sell-${index}-price`} min={0} onChange={(event) => updateTransaction("sellTransactions", index, "price", event.target.value)} step="0.01" type="number" value={transaction.price} />
                </label>
                <label className="field-label" htmlFor={`crypto-sell-${index}-quantity`}>
                  Sell {index + 1} quantity
                  <input className="input" id={`crypto-sell-${index}-quantity`} min={0} onChange={(event) => updateTransaction("sellTransactions", index, "quantity", event.target.value)} step="0.0001" type="number" value={transaction.quantity} />
                </label>
              </div>
            ))}
            <label className="field-label" htmlFor="crypto-current-price">
              Current price
              <input className="input" id="crypto-current-price" min={0} onChange={(event) => updateCurrentPrice(event.target.value)} step="0.01" type="number" value={values.currentPrice} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save transactions
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate crypto PnL
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>PnL summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show average basis and position PnL."}</p>
            </div>
            <span className="badge warn">Tax reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAverageCostBasis ?? "$0.00"}</strong>
              <span>Avg cost basis</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRealizedPnl ?? "$0.00"}</strong>
              <span>Realized PnL</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedUnrealizedPnl ?? "$0.00"}</strong>
              <span>Unrealized PnL</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRemainingQuantity ?? "0.0000"}</strong>
              <span>Remaining qty</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use this as PnL context, not as a tax filing record." : "Calculate first to review cost basis and PnL."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Crypto tax notes</h2>
        <div className="remediation-list">
          {taxNotes.map((item, index) => (
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
          <p>Transaction samples are stored only in this browser when you choose Save.</p>
        </div>
      </aside>
    </div>
  );
}
