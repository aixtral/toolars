"use client";

import { Calculator, PiggyBank, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateSavingsChallenge,
  defaultSavingsChallengeScenario,
  type SavingsChallengeInput,
  type SavingsChallengeMode,
  type SavingsChallengeResult
} from "@/lib/tools/savings-challenge";

type NumericSavingsField =
  | "startingAmount"
  | "weeklyIncrease"
  | "envelopeCount"
  | "monthlyIncome"
  | "essentialExpenses"
  | "savingsGoal"
  | "alreadySaved"
  | "targetMonths";

const trustRows = [
  ["Local", "Savings challenge assumptions stay in this browser session", "local"],
  ["Flexible", "Switch between 52-week, envelope, no-spend, and reverse plans", "warn"],
  ["Private", "Save only stores the local challenge plan when you choose it", ""]
] as const;

const challengeNotes = [
  "The 52-week challenge increases the weekly amount by the chosen increment.",
  "Envelope mode totals sequential envelopes from 1 through the envelope count.",
  "Reverse mode divides the remaining goal by the chosen target timeline and frequency."
];

export function SavingsChallengeWorkspace() {
  const [plan, setPlan] = useState<SavingsChallengeInput>(() => defaultSavingsChallengeScenario);
  const [result, setResult] = useState<SavingsChallengeResult | null>(null);

  const calculate = () => {
    setResult(calculateSavingsChallenge(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.savings-challenge.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: NumericSavingsField, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: string) => {
    setPlan((current) => ({ ...current, mode: value as SavingsChallengeMode }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="savings-challenge">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc savings workspace</span>
        <h1>Savings Challenge Calculator</h1>
        <p className="subtitle">Generate a savings challenge from weekly increases, envelope counts, no-spend savings, or reverse targets.</p>

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
          <a className="button button-outline" href="/tools/savings-challenge/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Challenge inputs</h2>
              <p className="tool-description">Use the VitalCalc 52-week sample, or switch to another savings pattern.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="savings-mode">
              Challenge mode
              <select className="input" id="savings-mode" onChange={(event) => updateMode(event.target.value)} value={plan.mode}>
                <option value="52week">52-week</option>
                <option value="envelope">Envelope</option>
                <option value="nospend">No-spend month</option>
                <option value="reverse">Reverse goal</option>
              </select>
            </label>
            <label className="field-label" htmlFor="savings-currency">
              Currency symbol
              <input className="input" id="savings-currency" onChange={(event) => setPlan((current) => ({ ...current, currency: event.target.value || "¥" }))} type="text" value={plan.currency} />
            </label>
            <label className="field-label" htmlFor="savings-start">
              Starting amount
              <input className="input" id="savings-start" min={0} onChange={(event) => updateNumber("startingAmount", event.target.value)} type="number" value={plan.startingAmount} />
            </label>
            <label className="field-label" htmlFor="savings-increase">
              Weekly increase
              <input className="input" id="savings-increase" min={0} onChange={(event) => updateNumber("weeklyIncrease", event.target.value)} type="number" value={plan.weeklyIncrease} />
            </label>
            <label className="field-label" htmlFor="savings-envelopes">
              Envelope count
              <input className="input" id="savings-envelopes" min={1} onChange={(event) => updateNumber("envelopeCount", event.target.value)} type="number" value={plan.envelopeCount} />
            </label>
            <label className="field-label" htmlFor="savings-goal">
              Savings goal
              <input className="input" id="savings-goal" min={0} onChange={(event) => updateNumber("savingsGoal", event.target.value)} type="number" value={plan.savingsGoal} />
            </label>
            <label className="field-label" htmlFor="savings-saved">
              Already saved
              <input className="input" id="savings-saved" min={0} onChange={(event) => updateNumber("alreadySaved", event.target.value)} type="number" value={plan.alreadySaved} />
            </label>
            <label className="field-label" htmlFor="savings-months">
              Target months
              <input className="input" id="savings-months" min={1} onChange={(event) => updateNumber("targetMonths", event.target.value)} type="number" value={plan.targetMonths} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save challenge
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Generate savings challenge
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Challenge summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to generate total savings, average amount, and duration."}</p>
            </div>
            <span className="badge local">{result ? result.frequencyLabel : "Challenge"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotal ?? "¥0"}</strong>
              <span>Total saved</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverage ?? "¥0"}</strong>
              <span>Average amount</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.durationLabel ?? "Run first"}</strong>
              <span>Duration</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.schedule.length) : "0"}</strong>
              <span>Schedule rows</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PiggyBank size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `${result.frequencyLabel} challenge` : "Waiting for calculation"}</strong>
              <small>{result ? "Schedule preview follows the selected challenge mode." : "Calculate first to review the savings cadence."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Challenge notes</h2>
        <div className="remediation-list">
          {challengeNotes.map((item, index) => (
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
          <p>Savings plans stay in the browser and can be saved locally for later review.</p>
        </div>
      </aside>
    </div>
  );
}
