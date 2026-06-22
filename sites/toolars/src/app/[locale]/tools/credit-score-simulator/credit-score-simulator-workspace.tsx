"use client";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCreditScoreSimulation,
  defaultCreditScoreScenario,
  type CreditScoreAction,
  type CreditScoreInput,
  type CreditScoreResult
} from "@/lib/tools/credit-score-simulator";

const trustRows = [
  ["Local", "Score, limit, balance, and action stay in this browser session", "local"],
  ["Educational", "Score impact is a simplified VitalCalc simulation, not a bureau score", "warn"],
  ["Private", "Save only stores the score scenario locally when you choose it", ""]
] as const;

const creditNotes = [
  "VitalCalc weights payoff and utilization changes with a simplified FICO-inspired model.",
  "Payment history is the largest scoring factor; a missed payment can remain on reports for years.",
  "Actual scores differ by bureau, model version, file thickness, account age, and recent inquiries."
];

const actions: Array<{ label: string; value: CreditScoreAction }> = [
  { label: "Pay off all credit cards", value: "payoff" },
  { label: "Pay off half of balance", value: "pay-half" },
  { label: "Take out a new loan", value: "new-loan" },
  { label: "Miss one payment", value: "miss-payment" },
  { label: "Request 50% limit increase", value: "increase-limit" },
  { label: "Close oldest credit card", value: "close-card" }
];

export function CreditScoreSimulatorWorkspace() {
  const [plan, setPlan] = useState<CreditScoreInput>(defaultCreditScoreScenario);
  const [result, setResult] = useState<CreditScoreResult | null>(null);

  const calculate = () => {
    setResult(calculateCreditScoreSimulation(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.credit-score-simulator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "currentScore" | "creditLimit" | "currentBalance", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateAction = (value: string) => {
    setPlan((current) => ({ ...current, action: value as CreditScoreAction }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="credit-score-simulator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc credit simulator</span>
        <h1>Credit Score Simulator</h1>
        <p className="subtitle">Simulate how utilization changes and common credit actions can move a score estimate.</p>

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
          <a className="button button-outline" href="/tools/credit-score-simulator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Credit scenario inputs</h2>
              <p className="tool-description">Use current score, credit limit, balance, and one simulated action.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="credit-score-current">
              Current credit score
              <input className="input" id="credit-score-current" max={850} min={300} onChange={(event) => updateNumber("currentScore", event.target.value)} type="number" value={plan.currentScore} />
            </label>
            <label className="field-label" htmlFor="credit-score-limit">
              Total credit limit
              <input className="input" id="credit-score-limit" min={1} onChange={(event) => updateNumber("creditLimit", event.target.value)} step="500" type="number" value={plan.creditLimit} />
            </label>
            <label className="field-label" htmlFor="credit-score-balance">
              Current balance
              <input className="input" id="credit-score-balance" min={0} onChange={(event) => updateNumber("currentBalance", event.target.value)} step="100" type="number" value={plan.currentBalance} />
            </label>
            <label className="field-label" htmlFor="credit-score-action">
              Simulated action
              <select className="input" id="credit-score-action" onChange={(event) => updateAction(event.target.value)} value={plan.action}>
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save score scenario
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Simulate score change
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Score simulation</h2>
              <p className="tool-description">{result ? result.summary : "Run simulation to review score impact and utilization changes."}</p>
            </div>
            <span className={`badge ${result && result.scoreChange < 0 ? "warn" : "local"}`}>{result ? (result.scoreChange < 0 ? "risk" : "impact") : "Score"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.newScore ?? "0"}</strong>
              <span>Simulated score</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedScoreChange ?? "0"}</strong>
              <span>Score change</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCurrentUtilization ?? "0.0%"}</strong>
              <span>Current utilization</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNewUtilization ?? "0.0%"}</strong>
              <span>New utilization</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>{result?.rating ?? "Waiting for simulation"}</strong>
              <small>{result ? `${result.actionLabel}. Score range position ${result.scoreRangePosition.toFixed(1)}%.` : "Simulate first to review the score range."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Credit model notes</h2>
        <div className="remediation-list">
          {creditNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Credit caveat
          </strong>
          <p>This educational model is not a credit report, underwriting decision, or bureau-calculated score.</p>
        </div>
      </aside>
    </div>
  );
}
