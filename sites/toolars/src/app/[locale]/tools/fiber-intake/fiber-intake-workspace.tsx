"use client";
import { useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Wheat } from "lucide-react";
import { useState } from "react";
import {
  calculateFiberIntake,
  defaultFiberIntakeScenario,
  fiberFoodReferences,
  type FiberIntakeInput,
  type FiberIntakeResult,
  type FiberSex
} from "@/lib/tools/fiber-intake";

const storageKey = "toolars.fiber-intake.profile:v1";

const trustRows = [
  ["Local", "Profile and intake values stay in this browser session", "local"],
  ["Gut health", "Increase fiber gradually and drink enough water", "warn"],
  ["Private", "Save stores only this fiber profile locally", ""]
] as const;

const fiberNotes = [
  "VitalCalc starts from weight x 0.35g and adjusts for female sex and age above 50.",
  "Adults generally need about 25-38g daily; most people consume less than the target.",
  "Too much fiber too quickly can cause bloating, gas, or digestive discomfort."
];

export function FiberIntakeWorkspace() {
  const t = useTranslations("tools.fiber-intake");
  const [values, setValues] = useState<FiberIntakeInput>(() => defaultFiberIntakeScenario);
  const [result, setResult] = useState<FiberIntakeResult | null>(null);

  const calculate = () => {
    setResult(calculateFiberIntake(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<FiberIntakeInput, "weightKg" | "age" | "currentFiberGrams">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="fiber-intake">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc nutrition target workspace</span>
        <h1>Fiber Intake Calculator</h1>
        <p className="subtitle">Estimate daily fiber needs, intake progress, and high-fiber food references.</p>

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
          <a className="button button-outline" href="/tools/fiber-intake/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Profile inputs</h2>
              <p className="tool-description">Use weight, age, sex, and optional current daily fiber intake.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="fiber-weight">
              Weight (kg)
              <input className="input" id="fiber-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="fiber-age">
              Age
              <input className="input" id="fiber-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} step="1" type="number" value={values.age} />
            </label>
            <label className="field-label" htmlFor="fiber-sex">
              Sex
              <select className="input" id="fiber-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as FiberSex }))} value={values.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="fiber-current">
              Current daily fiber
              <input className="input" id="fiber-current" min={0} onChange={(event) => updateNumber("currentFiberGrams", event.target.value)} step="0.5" type="number" value={values.currentFiberGrams} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save fiber profile
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate fiber needs
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fiber summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show daily target and intake gap."}</p>
            </div>
            <span className="badge local">{result ? `${result.progressPercent}%` : "Target"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRecommendedFiber ?? "0 g"}</strong>
              <span>Daily target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.recommendedRange ?? "0-0 g/day"}</strong>
              <span>Recommended range</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.progressPercent}%` : "0%"}</strong>
              <span>Progress</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGap ?? "0 g"}</strong>
              <span>Gap</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Wheat size={18} aria-hidden="true" />
            <span>
              <strong>{result ? `${result.formattedGap} remaining to target` : "Waiting for calculation"}</strong>
              <small>{result ? "Increase intake gradually and pair with hydration." : "Calculate first to review fiber needs."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Fiber notes</h2>
        <div className="remediation-list">
          {fiberNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="profile-list" style={{ marginTop: 18 }}>
          {fiberFoodReferences.map((food) => (
            <div className="profile-row" key={food.label}>
              <span>{food.label}</span>
              <strong>{food.fiberPer100g} g</strong>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Local-first
          </strong>
          <p>Fiber targets stay local and should be adjusted for individual digestive tolerance.</p>
        </div>
      </aside>
    </div>
  );
}
