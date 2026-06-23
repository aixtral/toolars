"use client";
import { useTranslations } from "next-intl";

import { Calculator, Clock3, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateIntermittentFasting,
  defaultIntermittentFastingScenario,
  intermittentFastingProtocolOptions,
  type IntermittentFastingInput,
  type IntermittentFastingProtocol,
  type IntermittentFastingResult
} from "@/lib/tools/intermittent-fasting";

const storageKey = "toolars.intermittent-fasting.plan:v1";

const trustRows = [
  ["Local", "Protocol and meal time stay in this browser session", "local"],
  ["Health", "Fasting is not appropriate for every medical or nutrition context", "warn"],
  ["Private", "Save stores only this local fasting plan", ""]
] as const;

const fastingNotes = [
  "VitalCalc maps 16:8, 18:6, 20:4, and 14:10 directly to fasting and eating windows.",
  "OMAD uses 23 fasting hours and 1 eating hour.",
  "5:2 is treated as 5 normal days plus 2 non-consecutive lower-calorie days."
];

export function IntermittentFastingWorkspace() {
  const t = useTranslations("tools.intermittent-fasting");
  const [plan, setPlan] = useState<IntermittentFastingInput>(() => defaultIntermittentFastingScenario);
  const [result, setResult] = useState<IntermittentFastingResult | null>(null);

  const calculate = () => {
    setResult(calculateIntermittentFasting(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof IntermittentFastingInput>(key: Key, value: IntermittentFastingInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="intermittent-fasting">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc fasting workspace</span>
        <h1>Intermittent Fasting Calculator</h1>
        <p className="subtitle">Plan eating and fasting windows from the source protocol table and last-meal time.</p>

        <h2 style={{ marginTop: 28 }}>Local schedule model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/intermittent-fasting/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Schedule inputs</h2>
              <p className="tool-description">Choose a protocol and the time your last meal ended.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="fasting-protocol">
              Fasting protocol
              <select className="input" id="fasting-protocol" onChange={(event) => updatePlan("protocol", event.target.value as IntermittentFastingProtocol)} value={plan.protocol}>
                {intermittentFastingProtocolOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="fasting-last-meal">
              Last meal time
              <input className="input" id="fasting-last-meal" onChange={(event) => updatePlan("lastMealTime", event.target.value)} type="time" value={plan.lastMealTime} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save fasting plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate windows
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fasting result</h2>
              <p className="tool-description">{result ? `${result.protocolLabel} plan from ${plan.lastMealTime}` : "Run calculation to show next meal, eating window, and fasting window."}</p>
            </div>
            <span className="badge warn">Schedule</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.nextMealTime ?? "--"}</strong>
              <span>Next meal</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFastingHours ?? "0 hours"}</strong>
              <span>Fasting duration</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.eatingWindow ?? "--"}</strong>
              <span>Eating window</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fastingWindow ?? "--"}</strong>
              <span>Fasting window</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.timeline ?? []).map((row) => (
              <div className="profile-row" key={row.label}>
                <span className={`badge ${row.tone === "active" ? "local" : ""}`}>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Clock3 size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Treat fasting windows as a planning aid, not a medical directive." : "Calculate first to build the fasting timeline."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Fasting notes</h2>
        <div className="remediation-list">
          {fastingNotes.map((item, index) => (
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
          <p>Avoid fasting during pregnancy, adolescent growth, eating-disorder risk, or diabetes medication changes without care guidance.</p>
        </div>
      </aside>
    </div>
  );
}
