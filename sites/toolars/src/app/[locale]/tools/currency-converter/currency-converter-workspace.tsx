"use client";
import { useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCurrencyConversion,
  currencyOptions,
  defaultCurrencyScenario,
  type CurrencyCode,
  type CurrencyInput,
  type CurrencyResult
} from "@/lib/tools/currency-converter";

const trustRows = [
  ["Local", "Amounts, currencies, and exchange rates stay in this browser session", "local"],
  ["Rates", "Rates are manually entered and not live market quotes", "warn"],
  ["Private", "Save only stores the conversion scenario locally when you choose it", ""]
] as const;

const rateNotes = [
  "VitalCalc converted amount equals source amount times the entered exchange rate.",
  "Bank, card, platform, spread, tax, and timing can change the real transaction cost.",
  "Use a current rate from your bank or FX source when the result matters."
];

export function CurrencyConverterWorkspace() {
  const t = useTranslations("tools.currency-converter");
  const [plan, setPlan] = useState<CurrencyInput>(defaultCurrencyScenario);
  const [result, setResult] = useState<CurrencyResult | null>(null);

  const calculate = () => {
    setResult(calculateCurrencyConversion(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.currency-converter.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "amount" | "exchangeRate", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateCurrency = (key: "fromCurrency" | "toCurrency", value: string) => {
    setPlan((current) => ({ ...current, [key]: value as CurrencyCode }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="currency-converter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc exchange-rate workspace</span>
        <h1>Currency Converter</h1>
        <p className="subtitle">Convert between major currencies using a rate you supply, with explicit freshness caveats.</p>

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
          <a className="button button-outline" href="/tools/currency-converter/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Exchange inputs</h2>
              <p className="tool-description">Use amount, source currency, target currency, and exchange rate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="currency-amount">
              Amount
              <input className="input" id="currency-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="0.01" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="currency-rate">
              Exchange rate
              <input className="input" id="currency-rate" min={0} onChange={(event) => updateNumber("exchangeRate", event.target.value)} step="0.0001" type="number" value={plan.exchangeRate} />
            </label>
            <label className="field-label" htmlFor="currency-from">
              From currency
              <select className="input" id="currency-from" onChange={(event) => updateCurrency("fromCurrency", event.target.value)} value={plan.fromCurrency}>
                {currencyOptions.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="currency-to">
              To currency
              <select className="input" id="currency-to" onChange={(event) => updateCurrency("toCurrency", event.target.value)} value={plan.toCurrency}>
                {currencyOptions.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save conversion
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Convert currency
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Converted amount summary</h2>
              <p className="tool-description">{result ? result.summary : "Run conversion to see target amount and rate context."}</p>
            </div>
            <span className="badge local">{result ? `${result.fromCurrency} to ${result.toCurrency}` : "FX"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedConvertedAmount ?? "0"}</strong>
              <span>Converted amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSourceAmount ?? "0"}</strong>
              <span>Source amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fromCurrency ?? plan.fromCurrency}</strong>
              <span>From</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.toCurrency ?? plan.toCurrency}</strong>
              <span>To</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{result?.rateDisplay ?? "Waiting for conversion"}</strong>
              <small>{result ? "Use current bank or platform rates for transaction decisions." : "Convert first to review the currency pair and rate."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Rate freshness notes</h2>
        <div className="remediation-list">
          {rateNotes.map((item, index) => (
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
          <p>No transaction or account data is sent anywhere by this manual conversion workspace.</p>
        </div>
      </aside>
    </div>
  );
}
