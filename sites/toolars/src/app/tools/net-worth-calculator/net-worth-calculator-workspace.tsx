"use client";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateNetWorth,
  defaultNetWorthScenario,
  type NetWorthInput,
  type NetWorthResult
} from "@/lib/tools/net-worth-calculator";

const trustRows = [
  ["Local", "Asset and liability assumptions stay in this browser session", "local"],
  ["Reference", "Net worth is a snapshot and should be trended over time", "warn"],
  ["Private", "Save only stores the snapshot locally when you choose it", ""]
] as const;

const netWorthNotes = [
  "VitalCalc defines net worth as total assets minus total liabilities.",
  "Track quarterly to see whether debt reduction and investing are changing the trend.",
  "A negative value usually calls for high-interest debt payoff and cash reserve planning first."
];

export function NetWorthCalculatorWorkspace() {
  const [plan, setPlan] = useState<NetWorthInput>(defaultNetWorthScenario);
  const [result, setResult] = useState<NetWorthResult | null>(null);

  const calculate = () => {
    setResult(calculateNetWorth(plan));
  };

  const saveSnapshot = () => {
    window.localStorage.setItem("toolars.net-worth-calculator.snapshot", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof NetWorthInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="net-worth-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc finance workspace</span>
        <h1>Net Worth Calculator</h1>
        <p className="subtitle">Calculate total assets minus total liabilities and review debt-to-asset exposure.</p>

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
          <a className="button button-outline" href="/tools/net-worth-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Asset inputs</h2>
              <p className="tool-description">Enter assets and liabilities to create a local financial snapshot.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="net-worth-home">
              Home value
              <input className="input" id="net-worth-home" min={0} onChange={(event) => updateNumber("homeValue", event.target.value)} type="number" value={plan.homeValue} />
            </label>
            <label className="field-label" htmlFor="net-worth-investments">
              Investment accounts
              <input className="input" id="net-worth-investments" min={0} onChange={(event) => updateNumber("investments", event.target.value)} type="number" value={plan.investments} />
            </label>
            <label className="field-label" htmlFor="net-worth-cash">
              Cash and savings
              <input className="input" id="net-worth-cash" min={0} onChange={(event) => updateNumber("cashSavings", event.target.value)} type="number" value={plan.cashSavings} />
            </label>
            <label className="field-label" htmlFor="net-worth-car">
              Vehicle value
              <input className="input" id="net-worth-car" min={0} onChange={(event) => updateNumber("vehicleValue", event.target.value)} type="number" value={plan.vehicleValue} />
            </label>
            <label className="field-label" htmlFor="net-worth-other-assets">
              Other assets
              <input className="input" id="net-worth-other-assets" min={0} onChange={(event) => updateNumber("otherAssets", event.target.value)} type="number" value={plan.otherAssets} />
            </label>
            <label className="field-label" htmlFor="net-worth-mortgage">
              Mortgage balance
              <input className="input" id="net-worth-mortgage" min={0} onChange={(event) => updateNumber("mortgageBalance", event.target.value)} type="number" value={plan.mortgageBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-car-loan">
              Car loan balance
              <input className="input" id="net-worth-car-loan" min={0} onChange={(event) => updateNumber("carLoanBalance", event.target.value)} type="number" value={plan.carLoanBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-credit-card">
              Credit card debt
              <input className="input" id="net-worth-credit-card" min={0} onChange={(event) => updateNumber("creditCardDebt", event.target.value)} type="number" value={plan.creditCardDebt} />
            </label>
            <label className="field-label" htmlFor="net-worth-student-loan">
              Student loan balance
              <input className="input" id="net-worth-student-loan" min={0} onChange={(event) => updateNumber("studentLoanBalance", event.target.value)} type="number" value={plan.studentLoanBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-other-debts">
              Other debts
              <input className="input" id="net-worth-other-debts" min={0} onChange={(event) => updateNumber("otherDebts", event.target.value)} type="number" value={plan.otherDebts} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
              <Save size={16} aria-hidden="true" /> Save snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate net worth
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Net worth summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to compare assets, liabilities, and net worth."}</p>
            </div>
            <span className={`badge ${result?.healthTone === "negative" ? "warn" : "local"}`}>{result?.healthTone === "negative" ? "Debt focus" : "Snapshot"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNetWorth ?? "$0"}</strong>
              <span>Net worth</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalAssets ?? "$0"}</strong>
              <span>Total assets</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalLiabilities ?? "$0"}</strong>
              <span>Total liabilities</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.debtToAssetRatioPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>Debt-to-asset ratio</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `Debt-to-asset ratio ${result.debtToAssetRatioPercent.toFixed(1)}%` : "Waiting for calculation"}</strong>
              <small>{result?.message ?? "Calculate first to see the snapshot health message."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Net worth notes</h2>
        <div className="remediation-list">
          {netWorthNotes.map((item, index) => (
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
          <p>No brokerage, bank, or lender data is required for this local snapshot.</p>
        </div>
      </aside>
    </div>
  );
}
