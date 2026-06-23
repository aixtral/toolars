"use client";
import { useTranslations } from "next-intl";

import { Calculator, Droplets, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCreatineDose,
  creatineTrainingOptions,
  defaultCreatineScenario,
  type CreatineInput,
  type CreatineResult,
  type CreatineTrainingIntensity,
  type CreatineWeightUnit
} from "@/lib/tools/creatine-calculator";

const storageKey = "toolars.creatine-calculator.plan:v1";

const trustRows = [
  ["Local", "Weight and supplement context stay in this browser session", "local"],
  ["Supplement", "Healthy adults still need context for kidney disease or medication", "warn"],
  ["Private", "Save stores only this supplement plan locally", ""]
] as const;

const supplementNotes = [
  "VitalCalc uses 0.03g/kg maintenance, rounded to 0.5g, with a 3-5g/day range.",
  "High-intensity training or vegetarian context raises the recommendation to 5g/day.",
  "Optional loading uses 20g/day split into 4 doses for 5-7 days, then maintenance."
];

export function CreatineCalculatorWorkspace() {
  const t = useTranslations("tools.creatine-calculator");
  const [plan, setPlan] = useState<CreatineInput>(() => defaultCreatineScenario);
  const [result, setResult] = useState<CreatineResult | null>(null);

  const calculate = () => {
    setResult(calculateCreatineDose(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof CreatineInput>(key: Key, value: CreatineInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="creatine-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc supplement workspace</span>
        <h1>Creatine Calculator</h1>
        <p className="subtitle">Estimate creatine monohydrate maintenance dose, optional loading phase, and hydration guidance.</p>

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
          <a className="button button-outline" href="/tools/creatine-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Supplement inputs</h2>
              <p className="tool-description">Use body weight, training context, diet context, and optional loading preference.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="creatine-weight">
              Weight
              <input className="input" id="creatine-weight" min={0} onChange={(event) => updatePlan("weight", Number(event.target.value))} type="number" value={plan.weight} />
            </label>
            <label className="field-label" htmlFor="creatine-unit">
              Unit
              <select className="input" id="creatine-unit" onChange={(event) => updatePlan("unit", event.target.value as CreatineWeightUnit)} value={plan.unit}>
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </label>
            <label className="field-label" htmlFor="creatine-training">
              Training intensity
              <select className="input" id="creatine-training" onChange={(event) => updatePlan("trainingIntensity", event.target.value as CreatineTrainingIntensity)} value={plan.trainingIntensity}>
                {creatineTrainingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            <label className="profile-row" htmlFor="creatine-vegetarian">
              <input checked={plan.vegetarian} id="creatine-vegetarian" onChange={(event) => updatePlan("vegetarian", event.target.checked)} type="checkbox" />
              <span>Vegetarian context</span>
            </label>
            <label className="profile-row" htmlFor="creatine-loading">
              <input checked={plan.loading} id="creatine-loading" onChange={(event) => updatePlan("loading", event.target.checked)} type="checkbox" />
              <span>Enable loading phase</span>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save supplement plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate creatine dose
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Creatine result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show maintenance dose and hydration guidance."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMaintenance ?? "0 g"}</strong>
              <span>Maintenance</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.rangeLabel ?? "3-5 g/day"}</strong>
              <span>Source range</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoadingDose ?? "Not enabled"}</strong>
              <span>Loading phase</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedExtraWater ?? "0 ml"}</strong>
              <span>Extra water</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplets size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? result.loadingProtocol : "Calculate first to review loading and hydration guidance."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Supplement notes</h2>
        <div className="remediation-list">
          {supplementNotes.map((item, index) => (
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
          <p>Supplement context stays local. Consult a clinician for kidney disease, medication, pregnancy, or symptoms.</p>
        </div>
      </aside>
    </div>
  );
}
