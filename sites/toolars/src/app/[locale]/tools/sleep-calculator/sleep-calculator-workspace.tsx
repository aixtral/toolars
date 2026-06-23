"use client";
import { useTranslations } from "next-intl";

import { Calculator, Moon, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateSleepSchedule,
  defaultSleepScenario,
  type SleepInput,
  type SleepMode,
  type SleepResult
} from "@/lib/tools/sleep-calculator";

const storageKey = "toolars.sleep-calculator.plan:v1";

const trustRows = [
  ["Local", "Sleep timing and cutoff settings stay in this browser session", "local"],
  ["Gentle", "Sleep timing is a guide, not a strict score target", "warn"],
  ["Private", "Save stores only this sleep plan locally", ""]
] as const;

const sleepNotes = [
  "VitalCalc uses 6, 5, 4, and 3 sleep-cycle options.",
  "Default cycle length is 90 minutes with 15 minutes to fall asleep.",
  "Caffeine, screen, dinner, and morning-light tips are derived from the primary time."
];

export function SleepCalculatorWorkspace() {
  const t = useTranslations("tools.sleep-calculator");
  const [plan, setPlan] = useState<SleepInput>(() => defaultSleepScenario);
  const [result, setResult] = useState<SleepResult | null>(null);

  const calculate = () => {
    setResult(calculateSleepSchedule(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof SleepInput>(key: Key, value: SleepInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="sleep-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc sleep workspace</span>
        <h1>Sleep Calculator</h1>
        <p className="subtitle">Calculate cycle-aligned bedtimes or wake-up times, plus caffeine, screen, dinner, and morning-light cutoffs.</p>

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
          <a className="button button-outline" href="/tools/sleep-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Sleep inputs</h2>
              <p className="tool-description">Choose a direction and tune the cycle model used by the VitalCalc source page.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="sleep-mode">
              Mode
              <select className="input" id="sleep-mode" onChange={(event) => updatePlan("mode", event.target.value as SleepMode)} value={plan.mode}>
                <option value="wakeup">Bedtime from wake-up</option>
                <option value="bedtime">Wake-up from bedtime</option>
              </select>
            </label>
            <label className="field-label" htmlFor="sleep-main-time">
              Main time
              <input className="input" id="sleep-main-time" onChange={(event) => updatePlan("mainTime", event.target.value)} type="time" value={plan.mainTime} />
            </label>
            <label className="field-label" htmlFor="sleep-latency">
              Sleep latency (minutes)
              <input className="input" id="sleep-latency" min={0} onChange={(event) => updatePlan("fallAsleepMinutes", Number(event.target.value))} type="number" value={plan.fallAsleepMinutes} />
            </label>
            <label className="field-label" htmlFor="sleep-cycle">
              Cycle length (minutes)
              <input className="input" id="sleep-cycle" min={1} onChange={(event) => updatePlan("cycleLengthMinutes", Number(event.target.value))} type="number" value={plan.cycleLengthMinutes} />
            </label>
            <label className="field-label" htmlFor="sleep-caffeine">
              Caffeine cutoff (hours)
              <input className="input" id="sleep-caffeine" min={0} onChange={(event) => updatePlan("caffeineCutoffHours", Number(event.target.value))} type="number" value={plan.caffeineCutoffHours} />
            </label>
            <label className="field-label" htmlFor="sleep-screen">
              Screen cutoff (hours)
              <input className="input" id="sleep-screen" min={0} onChange={(event) => updatePlan("screenCutoffHours", Number(event.target.value))} step="0.5" type="number" value={plan.screenCutoffHours} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save sleep plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate sleep time
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Sleep result</h2>
              <p className="tool-description">{result ? result.resultLabel : "Run calculation to show the primary time, alternatives, and sleepmaxxing cutoffs."}</p>
            </div>
            <span className="badge warn">{result?.modeLabel ?? "90-min cycles"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.primaryTime ?? "--"}</strong>
              <span>Primary time</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.caffeineCutoff ?? "--"}</strong>
              <span>Caffeine cutoff</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.screenCutoff ?? "--"}</strong>
              <span>Screen cutoff</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.morningLight ?? "--"}</strong>
              <span>Morning light</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.options ?? []).map((option) => (
              <div className="profile-row" key={option.cycles}>
                <span className="badge">{option.cycles} cycles</span>
                <span>
                  <strong>{option.time}</strong> - {option.hours}h asleep
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Moon size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? `Dinner cutoff: ${result.dinnerCutoff}` : "Calculate first to build the cutoff plan."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Sleep notes</h2>
        <div className="remediation-list">
          {sleepNotes.map((item, index) => (
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
          <p>Use timing as a gentle guide. Avoid orthosomnia or anxiety around perfect sleep scores.</p>
        </div>
      </aside>
    </div>
  );
}
