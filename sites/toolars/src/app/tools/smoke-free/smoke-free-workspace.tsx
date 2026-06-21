"use client";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateSmokeFree,
  defaultSmokeFreeScenario,
  type SmokeFreeInput,
  type SmokeFreeResult
} from "@/lib/tools/smoke-free";

const storageKey = "toolars.smoke-free.plan:v1";

const trustRows = [
  ["Local", "Quit date and smoking assumptions stay in this browser session", "local"],
  ["Health", "Recovery timelines vary by person and care history", "warn"],
  ["Private", "Save stores only the quit-tracker sample locally", ""]
] as const;

const recoveryNotes = [
  "VitalCalc counts full smoke-free days from the selected quit date.",
  "Life extension uses the source estimate of 11 minutes per cigarette not smoked.",
  "Use this tracker for motivation; relapse support and medical care can matter more than any single metric."
];

export function SmokeFreeWorkspace() {
  const [values, setValues] = useState<SmokeFreeInput>(() => defaultSmokeFreeScenario);
  const [result, setResult] = useState<SmokeFreeResult | null>(null);

  const calculate = () => {
    setResult(calculateSmokeFree(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<SmokeFreeInput, "cigarettesPerDay" | "pricePerPack" | "cigarettesPerPack">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateQuitDate = (value: string) => {
    setValues((current) => ({ ...current, quitDate: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="smoke-free">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc recovery tracker</span>
        <h1>Quit Smoking Tracker</h1>
        <p className="subtitle">Track smoke-free days, money saved, cigarettes avoided, and recovery milestones.</p>

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
          <a className="button button-outline" href="/tools/smoke-free/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Quit inputs</h2>
              <p className="tool-description">Use quit date, daily cigarette count, pack size, and pack price.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="smoke-quit-date">
              Quit date
              <input className="input" id="smoke-quit-date" onChange={(event) => updateQuitDate(event.target.value)} type="date" value={values.quitDate} />
            </label>
            <label className="field-label" htmlFor="smoke-cigs-per-day">
              Cigarettes per day
              <input className="input" id="smoke-cigs-per-day" min={0} onChange={(event) => updateNumber("cigarettesPerDay", event.target.value)} step="1" type="number" value={values.cigarettesPerDay} />
            </label>
            <label className="field-label" htmlFor="smoke-price-per-pack">
              Price per pack
              <input className="input" id="smoke-price-per-pack" min={0} onChange={(event) => updateNumber("pricePerPack", event.target.value)} step="0.01" type="number" value={values.pricePerPack} />
            </label>
            <label className="field-label" htmlFor="smoke-cigs-per-pack">
              Cigarettes per pack
              <input className="input" id="smoke-cigs-per-pack" min={1} onChange={(event) => updateNumber("cigarettesPerPack", event.target.value)} step="1" type="number" value={values.cigarettesPerPack} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save quit plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Track recovery
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Recovery summary</h2>
              <p className="tool-description">{result ? result.summary : "Run tracker to show progress and milestones."}</p>
            </div>
            <span className="badge local">{result ? "Progress" : "Tracker"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? `${result.daysSmokeFree.toLocaleString("en-US")} days` : "0 days"}</strong>
              <span>Smoke-free</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMoneySaved ?? "$0"}</strong>
              <span>Money saved</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCigarettesAvoided ?? "0 cigarettes"}</strong>
              <span>Not smoked</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLifeExtended ?? "0.0 days"}</strong>
              <span>Life estimate</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result?.nextMilestone ? `Next: ${result.nextMilestone.time}` : "Waiting for recovery timeline"}</strong>
              <small>{result?.nextMilestone?.message ?? "Track recovery to review source milestones."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Recovery notes</h2>
        <div className="remediation-list">
          {recoveryNotes.map((item, index) => (
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
          <p>Quit-tracker assumptions stay private in this browser unless you export or share them.</p>
        </div>
      </aside>
    </div>
  );
}
