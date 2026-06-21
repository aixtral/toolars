"use client";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCreditCardApr,
  defaultCreditCardAprScenario,
  type CreditCardAprInput,
  type CreditCardAprResult
} from "@/lib/tools/credit-card-apr";

const trustRows = [
  ["Local", "Installment amount and fee assumptions stay in this browser session", "local"],
  ["Terms", "Issuer disclosures, fees, and local rules can change actual APR", "warn"],
  ["Private", "Save only stores the APR scenario locally when you choose it", ""]
] as const;

const creditCostNotes = [
  "VitalCalc estimates true APR because fees are charged on original principal while principal declines.",
  "This workspace solves the monthly internal rate of return and annualizes it.",
  "Check issuer disclosures, late fees, compounding rules, and alternative financing before borrowing."
];

export function CreditCardAprWorkspace() {
  const [plan, setPlan] = useState<CreditCardAprInput>(defaultCreditCardAprScenario);
  const [result, setResult] = useState<CreditCardAprResult | null>(null);

  const calculate = () => {
    setResult(calculateCreditCardApr(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.credit-card-apr.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "amount" | "monthlyFeeRate", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updatePayments = (value: string) => {
    setPlan((current) => ({ ...current, payments: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="credit-card-apr">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc installment APR workspace</span>
        <h1>Credit Card APR Calculator</h1>
        <p className="subtitle">Reveal the estimated true annual rate behind monthly installment fees.</p>

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
          <a className="button button-outline" href="/tools/credit-card-apr/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Installment inputs</h2>
              <p className="tool-description">Use installment amount, payment count, and monthly fee rate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="apr-amount">
              Installment amount
              <input className="input" id="apr-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="1" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="apr-payments">
              Number of payments
              <select className="input" id="apr-payments" onChange={(event) => updatePayments(event.target.value)} value={plan.payments}>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </label>
            <label className="field-label" htmlFor="apr-fee-rate">
              Monthly fee rate
              <input className="input" id="apr-fee-rate" min={0} onChange={(event) => updateNumber("monthlyFeeRate", event.target.value)} step="0.01" type="number" value={plan.monthlyFeeRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save APR plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Reveal true APR
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>True APR summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to reveal estimated APR and installment cost."}</p>
            </div>
            <span className={`badge ${result?.guidanceTone === "high" ? "warn" : "local"}`}>{result ? result.guidanceTone : "APR"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedApr ?? "0.00%"}</strong>
              <span>Estimated APR</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNominalTotalRate ?? "0.00%"}</strong>
              <span>Nominal total rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalFees ?? "$0"}</strong>
              <span>Total fees</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalPayment ?? "$0"}</strong>
              <span>Total payment</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedMonthlyPayment ?? "Waiting for calculation"}</strong>
              <small>{result?.guidance ?? "Calculate first to compare nominal fees with estimated true APR."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Credit cost notes</h2>
        <div className="remediation-list">
          {creditCostNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Terms check
          </strong>
          <p>APR output is an estimate and should be checked against issuer disclosures before borrowing.</p>
        </div>
      </aside>
    </div>
  );
}
