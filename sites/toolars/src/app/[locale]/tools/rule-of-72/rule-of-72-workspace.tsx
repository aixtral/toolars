"use client";
import { useTranslations } from "next-intl";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateRuleOf72,
  defaultRuleOf72Scenario,
  type RuleOf72Input,
  type RuleOf72Result
} from "@/lib/tools/rule-of-72";

const trustRows = [
  ["Local", "Rate and principal stay in this browser session", "local"],
  ["Shortcut", "The Rule of 72 is approximate, especially outside 6-10%", "warn"],
  ["Private", "Save only stores the scenario locally when you choose it", ""]
] as const;

const shortcutNotes = [
  "VitalCalc divides 72 by the annual return rate to estimate doubling time.",
  "Exact doubling time uses logarithms: ln(2) divided by ln(1 + rate).",
  "The shortcut is intuitive, but extreme rates need the exact figure and broader context."
];

export function RuleOf72Workspace() {
  const t = useTranslations("tools.rule-of-72");
  const [plan, setPlan] = useState<RuleOf72Input>(defaultRuleOf72Scenario);
  const [result, setResult] = useState<RuleOf72Result | null>(null);

  const calculate = () => {
    setResult(calculateRuleOf72(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.rule-of-72.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RuleOf72Input, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="rule-of-72">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc doubling-time workspace</span>
        <h1>Rule of 72 Calculator</h1>
        <p className="subtitle">Estimate how long an investment takes to double, then compare against exact compounding.</p>

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
          <a className="button button-outline" href="/tools/rule-of-72/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Doubling inputs</h2>
              <p className="tool-description">Use annual return and initial investment to estimate doubling time.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="rule-return">
              Annual return rate
              <input className="input" id="rule-return" min={0} onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="rule-principal">
              Initial investment
              <input className="input" id="rule-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} step="1" type="number" value={plan.principal} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save Rule of 72 case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate doubling time
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Doubling time summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to compare shortcut and exact doubling time."}</p>
            </div>
            <span className={`badge ${result?.accuracyTone === "rough" ? "warn" : "local"}`}>{result?.accuracyTone ?? "Rule"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRuleYears ?? "0.0 years"}</strong>
              <span>Rule of 72 estimate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedExactYears ?? "0.00 years"}</strong>
              <span>Exact doubling time</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDoubledValue ?? "$0"}</strong>
              <span>Doubled value</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReverseTenYearRate ?? "0.0%"}</strong>
              <span>Rate for 10-year double</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>{result ? "Exact comparison ready" : "Waiting for calculation"}</strong>
              <small>{result ? `${result.schedule[0]?.formattedValue ?? "$0"} after year 1 in the simple annual schedule.` : "Calculate first to review the growth shortcut."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Shortcut notes</h2>
        <div className="remediation-list">
          {shortcutNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Shortcut only
          </strong>
          <p>Use exact compounding and investment context when the estimate drives a real decision.</p>
        </div>
      </aside>
    </div>
  );
}
