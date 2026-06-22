"use client";

import { Calculator, CalendarDays, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateOvulation,
  defaultOvulationScenario,
  type OvulationInput,
  type OvulationResult
} from "@/lib/tools/ovulation-calculator";

const storageKey = "toolars.ovulation-calculator.cycle:v1";

const trustRows = [
  ["Local", "Cycle dates stay in this browser session", "local"],
  ["Health", "Cycle estimates vary with irregularity and symptoms", "warn"],
  ["Private", "Save stores only this cycle sample locally", ""]
] as const;

const cycleNotes = [
  "VitalCalc estimates ovulation about 14 days before the next period.",
  "The fertile window spans roughly 5 days before ovulation through 1 day after.",
  "This is not contraception. Irregular cycles and fertility concerns need qualified care."
];

export function OvulationCalculatorWorkspace() {
  const [cycle, setCycle] = useState<OvulationInput>(() => defaultOvulationScenario);
  const [result, setResult] = useState<OvulationResult | null>(null);

  const calculate = () => {
    setResult(calculateOvulation(cycle));
  };

  const saveCycle = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cycle));
    } catch {}
  };

  const updateCycle = (key: keyof OvulationInput, value: string) => {
    setCycle((current) => ({
      ...current,
      [key]: key === "lastPeriodDate" ? value : Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="ovulation-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc cycle workspace</span>
        <h1>Ovulation Calculator</h1>
        <p className="subtitle">Estimate ovulation day, fertile window, next period, and cycle milestones locally.</p>

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
          <a className="button button-outline" href="/tools/ovulation-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Cycle inputs</h2>
              <p className="tool-description">Use last period date, cycle length, and period duration for a local estimate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="ovulation-lmp">
              First day of last period
              <input className="input" id="ovulation-lmp" onChange={(event) => updateCycle("lastPeriodDate", event.target.value)} type="date" value={cycle.lastPeriodDate} />
            </label>
            <label className="field-label" htmlFor="ovulation-cycle">
              Cycle length
              <select className="input" id="ovulation-cycle" onChange={(event) => updateCycle("cycleLengthDays", event.target.value)} value={cycle.cycleLengthDays}>
                {Array.from({ length: 15 }, (_, index) => index + 21).map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="ovulation-period">
              Period duration
              <select className="input" id="ovulation-period" onChange={(event) => updateCycle("periodDurationDays", event.target.value)} value={cycle.periodDurationDays}>
                {Array.from({ length: 5 }, (_, index) => index + 3).map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveCycle} type="button">
              <Save size={16} aria-hidden="true" /> Save cycle
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate cycle
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Cycle result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate fertile window and next period."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedOvulationDate ?? "--"}</strong>
              <span>Ovulation</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFertileWindow ?? "--"}</strong>
              <span>Fertile window</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNextPeriod ?? "--"}</strong>
              <span>Next period</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSafePeriod ?? "--"}</strong>
              <span>Safe-period reference</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedMenstruation ?? "Waiting for calculation"}</strong>
              <small>{result ? result.recommendation : "Calculate first to create the cycle calendar."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Cycle notes</h2>
        <div className="remediation-list">
          {cycleNotes.map((item, index) => (
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
          <p>Cycle dates stay local. Use this as a planning reference, not a diagnosis or contraception method.</p>
        </div>
      </aside>
    </div>
  );
}
