"use client";
import { useTranslations } from "next-intl";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateBillSplit,
  defaultBillSplitScenario,
  type BillSplitInput,
  type BillSplitResult,
  type BillSplitMode
} from "@/lib/tools/bill-split-calculator";

const trustRows = [
  ["Local", "Subtotal, tips, taxes, and people count stay in this browser session", "local"],
  ["Agreement", "Group bill outputs should be confirmed before payment", "warn"],
  ["Private", "Save only stores the bill plan locally when you choose it", ""]
] as const;

const splitNotes = [
  "VitalCalc adds tip and tax to subtotal before calculating the group total.",
  "Equal split is best when everyone agrees to divide the full bill evenly.",
  "Use itemized mode as a fairness reminder when people ordered different items."
];

export function BillSplitCalculatorWorkspace() {
  const t = useTranslations("tools.bill-split-calculator");
  const [plan, setPlan] = useState<BillSplitInput>(defaultBillSplitScenario);
  const [result, setResult] = useState<BillSplitResult | null>(null);

  const calculate = () => {
    setResult(calculateBillSplit(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.bill-split-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Omit<BillSplitInput, "splitMode">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: string) => {
    setPlan((current) => ({ ...current, splitMode: value as BillSplitMode }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bill-split-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc everyday finance workspace</span>
        <h1>Bill Split Calculator</h1>
        <p className="subtitle">Split shared bills with tip, tax, group size, and fairness guidance.</p>

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
          <a className="button button-outline" href="/tools/bill-split-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Bill inputs</h2>
              <p className="tool-description">Use subtotal, people, tip, and tax to calculate the group total.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="split-subtotal">
              Subtotal
              <input className="input" id="split-subtotal" min={0} onChange={(event) => updateNumber("subtotal", event.target.value)} step="0.01" type="number" value={plan.subtotal} />
            </label>
            <label className="field-label" htmlFor="split-people">
              People
              <input className="input" id="split-people" min={1} onChange={(event) => updateNumber("people", event.target.value)} type="number" value={plan.people} />
            </label>
            <label className="field-label" htmlFor="split-tip">
              Tip percent
              <input className="input" id="split-tip" min={0} onChange={(event) => updateNumber("tipPercent", event.target.value)} step="0.1" type="number" value={plan.tipPercent} />
            </label>
            <label className="field-label" htmlFor="split-tax">
              Tax percent
              <input className="input" id="split-tax" min={0} onChange={(event) => updateNumber("taxPercent", event.target.value)} step="0.01" type="number" value={plan.taxPercent} />
            </label>
            <label className="field-label" htmlFor="split-mode">
              Split mode
              <select className="input" id="split-mode" onChange={(event) => updateMode(event.target.value)} value={plan.splitMode}>
                <option value="equal">Equal</option>
                <option value="itemized">Itemized reminder</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save bill
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate split
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Group split summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see total fees and each person's share."}</p>
            </div>
            <span className="badge local">{result?.splitMode ?? "Split"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedGrandTotal ?? "$0.00"}</strong>
              <span>Grand total</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEqualShare ?? "$0.00"}</strong>
              <span>Equal share</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFees ?? "$0.00"}</strong>
              <span>Tip + tax</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSubtotal ?? "$0.00"}</strong>
              <span>Subtotal</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result?.guidance ?? "Calculate first to review split mode and total fees."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Split notes</h2>
        <div className="remediation-list">
          {splitNotes.map((item, index) => (
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
          <p>No receipt photo or names are required for the equal split workflow.</p>
        </div>
      </aside>
    </div>
  );
}
