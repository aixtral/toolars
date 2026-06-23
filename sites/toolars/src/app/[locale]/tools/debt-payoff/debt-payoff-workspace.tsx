"use client";
import { useTranslations } from "next-intl";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateDebtPayoff,
  defaultDebtPayoffScenario,
  type DebtPayoffInput,
  type DebtPayoffResult,
  type DebtPayoffStrategy
} from "@/lib/tools/debt-payoff";

const trustRows = [
  ["Local", "Debt, rate, and payment assumptions stay in this browser session", "local"],
  ["Reference", "Single-debt plans make avalanche and snowball equivalent", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const debtNotes = [
  "VitalCalc uses a monthly interest loop and stops at 600 months.",
  "Payments must exceed monthly interest or principal will not fall.",
  "For multiple debts, avalanche reduces interest while snowball may improve motivation."
];

export function DebtPayoffWorkspace() {
  const t = useTranslations("tools.debt-payoff");
  const [plan, setPlan] = useState<DebtPayoffInput>(defaultDebtPayoffScenario);
  const [result, setResult] = useState<DebtPayoffResult | null>(null);

  const calculate = () => {
    setResult(calculateDebtPayoff(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.debt-payoff.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "debtBalance" | "annualInterestRate" | "monthlyPayment", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateStrategy = (value: string) => {
    setPlan((current) => ({ ...current, strategy: value as DebtPayoffStrategy }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="debt-payoff">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Debt Payoff Calculator</h1>
        <p className="subtitle">Estimate payoff time, interest, and the first-month principal split.</p>

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
          <a className="button button-outline" href="/tools/debt-payoff/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Debt inputs</h2>
              <p className="tool-description">Use the VitalCalc sample, then adjust balance, APR, payment, and payoff strategy.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="debt-payoff-balance">
              Total debt
              <input className="input" id="debt-payoff-balance" min={0} onChange={(event) => updateNumber("debtBalance", event.target.value)} type="number" value={plan.debtBalance} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-rate">
              Annual interest rate
              <input className="input" id="debt-payoff-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-payment">
              Monthly payment
              <input className="input" id="debt-payoff-payment" min={0} onChange={(event) => updateNumber("monthlyPayment", event.target.value)} type="number" value={plan.monthlyPayment} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-strategy">
              Strategy
              <select className="input" id="debt-payoff-strategy" onChange={(event) => updateStrategy(event.target.value)} value={plan.strategy}>
                <option value="avalanche">Avalanche</option>
                <option value="snowball">Snowball</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save payoff plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate payoff
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Payoff summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate payoff months and total interest."}</p>
            </div>
            <span className="badge warn">Debt plan</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result && !result.isPaymentTooLow ? `${result.monthsToPayoff} months` : "0 months"}</strong>
              <span>Months to payoff</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>Total interest</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalPaid ?? "$0"}</strong>
              <span>Total paid</span>
            </article>
            <article className="llm-metric">
              <strong>{plan.strategy === "snowball" ? "Snowball" : "Avalanche"}</strong>
              <span>Strategy</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>
                {result
                  ? result.isPaymentTooLow
                    ? result.warning
                    : `Month 1 principal ${result.firstMonth.formattedPrincipal} + interest ${result.firstMonth.formattedInterest}`
                  : "Waiting for calculation"}
              </strong>
              <small>{result ? result.strategyMessage : "Calculate first to see the first-month split."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Debt payoff notes</h2>
        <div className="remediation-list">
          {debtNotes.map((item, index) => (
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
          <p>No lender or account data is required. Use this as a payoff estimate.</p>
        </div>
      </aside>
    </div>
  );
}
