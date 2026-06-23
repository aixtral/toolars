"use client";
import { useTranslations } from "next-intl";

import { CalendarDays, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculatePregnancyDueDate,
  defaultPregnancyDueDateScenario,
  type PregnancyDueDateInput,
  type PregnancyDueDateResult
} from "@/lib/tools/pregnancy-due-date";

const trustRows = [
  ["Local", "Reproductive health dates stay in this browser session", "local"],
  ["Medical", "Due date estimates need clinician confirmation", "warn"],
  ["Privacy", "Save only when you choose local timeline storage", ""]
] as const;

const medicalNotes = [
  "Pregnancy timeline output is an estimate, not a diagnosis.",
  "Ultrasound dating, IVF context, cycle irregularity, and clinician guidance can change the timeline.",
  "Seek urgent medical care for severe pain, bleeding, or concerning symptoms."
];

export function PregnancyDueDateWorkspace() {
  const t = useTranslations("tools.pregnancy-due-date");
  const [timeline, setTimeline] = useState<PregnancyDueDateInput>(defaultPregnancyDueDateScenario);
  const [result, setResult] = useState<PregnancyDueDateResult | null>(null);

  const calculate = () => {
    setResult(calculatePregnancyDueDate(timeline));
  };

  const saveTimeline = () => {
    window.localStorage.setItem("toolars.pregnancy-due-date.timeline", JSON.stringify(timeline));
  };

  const updateTimeline = (key: keyof PregnancyDueDateInput, value: string) => {
    setTimeline((current) => ({
      ...current,
      [key]: key === "cycleLengthDays" ? Number(value) : value
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="pregnancy-due-date">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>Pregnancy Due Date Calculator</h1>
        <p className="subtitle">Estimate due date, conception date, gestational age, trimester, and remaining days locally.</p>

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
          <a className="button button-outline" href="/tools/pregnancy-due-date/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Pregnancy timeline</h2>
              <p className="tool-description">Use LMP and cycle length to adjust the standard 40-week due date estimate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="pregnancy-lmp">
              Last menstrual period
              <input className="input" id="pregnancy-lmp" onChange={(event) => updateTimeline("lmpDate", event.target.value)} type="date" value={timeline.lmpDate} />
            </label>
            <label className="field-label" htmlFor="pregnancy-cycle">
              Cycle length
              <select className="input" id="pregnancy-cycle" onChange={(event) => updateTimeline("cycleLengthDays", event.target.value)} value={timeline.cycleLengthDays}>
                {Array.from({ length: 15 }, (_, index) => index + 21).map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveTimeline} type="button">
              <Save size={16} aria-hidden="true" /> Save timeline
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate due date
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Due date result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate pregnancy timeline."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedDueDate ?? "--"}</strong>
              <span>Estimated due date</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.gestationalAgeLabel ?? "--"}</strong>
              <span>Current week</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.trimester ?? "--"}</strong>
              <span>Trimester</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.daysRemainingLabel ?? "--"}</strong>
              <span>Days until due</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedConceptionDate ?? "Waiting for calculation"}</strong>
              <small>{result ? `Pregnancy progress ${result.progressPercent}%` : "Calculate first to estimate conception date and progress."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Medical reference notes</h2>
        <div className="remediation-list">
          {medicalNotes.map((item, index) => (
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
          <p>No account storage is required. This workspace is for pregnancy planning reference only.</p>
        </div>
      </aside>
    </div>
  );
}
