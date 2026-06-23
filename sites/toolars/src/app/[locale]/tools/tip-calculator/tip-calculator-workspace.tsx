"use client";
import { useTranslations } from "next-intl";

import { Calculator, Receipt, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateTip, defaultTipScenario, type TipInput, type TipResult } from "@/lib/tools/tip-calculator";

const trustRows = [
  ["Local", "Bill, tip, and group size stay in this browser session", "local"],
  ["Reference", "Tipping norms vary by country, service type, and group agreement", "warn"],
  ["Private", "Save only stores the split locally when you choose it", ""]
] as const;

const tipNotes = [
  "VitalCalc calculates tip amount as bill multiplied by tip percentage.",
  "Per-person share divides the full bill plus tip by the group size.",
  "Confirm whether tax should be tipped on before collecting from the group."
];

export function TipCalculatorWorkspace() {
  const t = useTranslations("tools.tip-calculator");
  const [plan, setPlan] = useState<TipInput>(defaultTipScenario);
  const [result, setResult] = useState<TipResult | null>(null);

  const calculate = () => {
    setResult(calculateTip(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.tip-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof TipInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="tip-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc everyday finance workspace</span>
        <h1>Tip Calculator</h1>
        <p className="subtitle">Calculate tip amount, total bill, and per-person share for restaurants and group outings.</p>

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
          <a className="button button-outline" href="/tools/tip-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Tip inputs</h2>
              <p className="tool-description">Use the VitalCalc sample bill or enter a live check before collecting.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="tip-bill">
              Bill amount
              <input className="input" id="tip-bill" min={0} onChange={(event) => updateNumber("billAmount", event.target.value)} step="0.01" type="number" value={plan.billAmount} />
            </label>
            <label className="field-label" htmlFor="tip-percent">
              Tip percent
              <input className="input" id="tip-percent" min={0} onChange={(event) => updateNumber("tipPercent", event.target.value)} step="0.1" type="number" value={plan.tipPercent} />
            </label>
            <label className="field-label" htmlFor="tip-people">
              People
              <input className="input" id="tip-people" min={1} onChange={(event) => updateNumber("people", event.target.value)} type="number" value={plan.people} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save split
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate tip
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Tip and split summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see the total and each person's share."}</p>
            </div>
            <span className="badge local">{result ? `${result.people} people` : "Tip"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalBill ?? "$0.00"}</strong>
              <span>Total bill</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTipAmount ?? "$0.00"}</strong>
              <span>Tip amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBillAmount ?? "$0.00"}</strong>
              <span>Original bill</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPerPersonShare ?? "$0.00"}</strong>
              <span>Per person</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Receipt size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? "Waiting for calculation"}</strong>
              <small>{result ? "Share this number before payment so the group agrees on the total." : "Calculate first to review bill and tip assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Tipping notes</h2>
        <div className="remediation-list">
          {tipNotes.map((item, index) => (
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
          <p>No receipt upload or account is required. The bill math runs locally.</p>
        </div>
      </aside>
    </div>
  );
}
