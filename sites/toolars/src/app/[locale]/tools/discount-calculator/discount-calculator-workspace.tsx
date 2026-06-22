"use client";

import { Calculator, Percent, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateDiscount,
  defaultDiscountScenario,
  type DiscountInput,
  type DiscountResult
} from "@/lib/tools/discount-calculator";

const trustRows = [
  ["Local", "Price, discount, and tax inputs stay in this browser session", "local"],
  ["Context", "Retailer checkout rules, fees, and stacked coupons can change totals", "warn"],
  ["Private", "Save only stores the discount scenario locally when you choose it", ""]
] as const;

const checkoutNotes = [
  "VitalCalc discount amount equals original price times discount percentage.",
  "Tax is applied after the discount in this simple checkout model.",
  "Confirm shipping, fees, stacked coupons, and retailer-specific rules before checkout."
];

export function DiscountCalculatorWorkspace() {
  const [plan, setPlan] = useState<DiscountInput>(defaultDiscountScenario);
  const [result, setResult] = useState<DiscountResult | null>(null);

  const calculate = () => {
    setResult(calculateDiscount(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.discount-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof DiscountInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="discount-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc checkout workspace</span>
        <h1>Discount Calculator</h1>
        <p className="subtitle">Calculate sale price, discount amount, tax, and final checkout cost locally.</p>

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
          <a className="button button-outline" href="/tools/discount-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Checkout inputs</h2>
              <p className="tool-description">Use original price, discount percentage, and optional tax percentage.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="discount-original">
              Original price
              <input className="input" id="discount-original" min={0} onChange={(event) => updateNumber("originalPrice", event.target.value)} step="0.01" type="number" value={plan.originalPrice} />
            </label>
            <label className="field-label" htmlFor="discount-percent">
              Discount percent
              <input className="input" id="discount-percent" min={0} onChange={(event) => updateNumber("discountPercent", event.target.value)} step="0.1" type="number" value={plan.discountPercent} />
            </label>
            <label className="field-label" htmlFor="discount-tax">
              Tax percent
              <input className="input" id="discount-tax" min={0} onChange={(event) => updateNumber("taxPercent", event.target.value)} step="0.1" type="number" value={plan.taxPercent} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save discount
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate discount
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Final price summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see final checkout price and savings."}</p>
            </div>
            <span className="badge local">{result ? "Checkout" : "Sale"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFinalPrice ?? "$0.00"}</strong>
              <span>Final price</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDiscountAmount ?? "$0.00"}</strong>
              <span>Discount amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTaxAmount ?? "$0.00"}</strong>
              <span>Tax amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOriginalPrice ?? "$0.00"}</strong>
              <span>Original price</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Percent size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? `${result.formattedPriceAfterDiscount} before tax.` : "Calculate first to review the checkout assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Checkout notes</h2>
        <div className="remediation-list">
          {checkoutNotes.map((item, index) => (
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
          <p>Shopping assumptions stay in this browser and are saved only when you choose Save.</p>
        </div>
      </aside>
    </div>
  );
}
