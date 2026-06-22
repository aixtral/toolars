"use client";

import { Calculator, Save, ShieldCheck, Wine } from "lucide-react";
import { useState } from "react";
import {
  alcoholDrinkData,
  calculateAlcoholMetabolism,
  defaultAlcoholMetabolismScenario,
  type AlcoholDrinkType,
  type AlcoholMetabolismInput,
  type AlcoholMetabolismResult,
  type AlcoholSex,
  type AlcoholStomachState
} from "@/lib/tools/alcohol-metabolism";

const storageKey = "toolars.alcohol-metabolism.scenario:v1";

const trustRows = [
  ["Local", "Drink assumptions stay in this browser session", "local"],
  ["Safety", "Never use estimates to decide whether to drive", "warn"],
  ["Private", "Save stores only this alcohol scenario locally", ""]
] as const;

const safetyNotes = [
  "VitalCalc uses a Widmark-style estimate and 0.015% BAC per hour metabolism rate.",
  "Food, drinking speed, medication, sleep, tolerance, and body composition can materially change actual BAC.",
  "Legal limits differ by country and state; the safest choice is not driving after drinking."
];

export function AlcoholMetabolismWorkspace() {
  const [values, setValues] = useState<AlcoholMetabolismInput>(() => defaultAlcoholMetabolismScenario);
  const [result, setResult] = useState<AlcoholMetabolismResult | null>(null);

  const calculate = () => {
    setResult(calculateAlcoholMetabolism(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<AlcoholMetabolismInput, "weightKg" | "quantity" | "durationHours">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="alcohol-metabolism">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc alcohol safety workspace</span>
        <h1>Alcohol Metabolism Calculator</h1>
        <p className="subtitle">Estimate blood alcohol concentration, metabolism time, and a short safety timeline.</p>

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
          <a className="button button-outline" href="/tools/alcohol-metabolism/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Drink inputs</h2>
              <p className="tool-description">Use source drink table, duration, sex, weight, and stomach state.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="alcohol-sex">
              Sex
              <select className="input" id="alcohol-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as AlcoholSex }))} value={values.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="alcohol-weight">
              Weight (kg)
              <input className="input" id="alcohol-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="alcohol-drink">
              Drink type
              <select className="input" id="alcohol-drink" onChange={(event) => setValues((current) => ({ ...current, drinkType: event.target.value as AlcoholDrinkType }))} value={values.drinkType}>
                {Object.entries(alcoholDrinkData).map(([value, drink]) => (
                  <option key={value} value={value}>
                    {drink.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="alcohol-quantity">
              Number of drinks
              <input className="input" id="alcohol-quantity" min={0} onChange={(event) => updateNumber("quantity", event.target.value)} step="0.5" type="number" value={values.quantity} />
            </label>
            <label className="field-label" htmlFor="alcohol-duration">
              Drinking duration (hours)
              <input className="input" id="alcohol-duration" min={0} onChange={(event) => updateNumber("durationHours", event.target.value)} step="0.5" type="number" value={values.durationHours} />
            </label>
            <label className="field-label" htmlFor="alcohol-stomach">
              Stomach state
              <select className="input" id="alcohol-stomach" onChange={(event) => setValues((current) => ({ ...current, stomach: event.target.value as AlcoholStomachState }))} value={values.stomach}>
                <option value="ate">Ate before drinking</option>
                <option value="empty">Empty stomach</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save alcohol scenario
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate alcohol metabolism
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>BAC summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show source BAC estimate and clearance times."}</p>
            </div>
            <span className="badge warn">{result?.status ?? "Safety"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBac ?? "0.000%"}</strong>
              <span>Estimated BAC</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPureAlcohol ?? "0.0 g"}</strong>
              <span>Pure alcohol</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTimeTo002 ?? "0 hours"}</strong>
              <span>Time to 0.02%</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTimeToZero ?? "0 hours"}</strong>
              <span>Fully sober</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Wine size={18} aria-hidden="true" />
            <span>
              <strong>{result?.status ?? "Waiting for calculation"}</strong>
              <small>{result ? "This is educational only; do not use it as driving clearance." : "Calculate first to review the safety estimate."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Safety notes</h2>
        <div className="remediation-list">
          {safetyNotes.map((item, index) => (
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
          <p>Alcohol estimates stay local and are not a legal, medical, or driving-safety decision tool.</p>
        </div>
      </aside>
    </div>
  );
}
