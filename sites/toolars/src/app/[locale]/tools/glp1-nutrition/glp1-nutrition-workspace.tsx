"use client";
import { useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Heart } from "lucide-react";
import { useState } from "react";
import {
  calculateGlp1Nutrition,
  defaultGlp1NutritionScenario,
  glp1ActivityLabels,
  glp1MedicationLabels,
  type Glp1Medication,
  type Glp1NutritionInput,
  type Glp1NutritionResult,
  type Glp1NutritionSex
} from "@/lib/tools/glp1-nutrition";

const storageKey = "toolars.glp1-nutrition.plan:v1";

const trustRows = [
  ["Local", "Nutrition context stays in this browser session", "local"],
  ["Medical", "Targets require clinician and dietitian adjustment", "warn"],
  ["Private", "Save stores only this local nutrition plan", ""]
] as const;

const medicationNotes = [
  "VitalCalc uses Mifflin-St Jeor BMR, TDEE x 0.75, and a sex-specific calorie floor.",
  "Protein uses 1.4g/kg; water uses 35ml/kg plus 500ml above lightly active.",
  "GLP-1 medication side effects, under-eating risk, and muscle loss need professional supervision."
];

export function Glp1NutritionWorkspace() {
  const t = useTranslations("tools.glp1-nutrition");
  const [values, setValues] = useState<Glp1NutritionInput>(() => defaultGlp1NutritionScenario);
  const [result, setResult] = useState<Glp1NutritionResult | null>(null);

  const calculate = () => {
    setResult(calculateGlp1Nutrition(values));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<Glp1NutritionInput, "weightKg" | "heightCm" | "age" | "activityFactor">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="glp1-nutrition">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc GLP-1 nutrition workspace</span>
        <h1>GLP-1 Nutrition Calculator</h1>
        <p className="subtitle">Estimate calorie floor, protein, fiber, and hydration targets for clinician-supervised GLP-1 nutrition planning.</p>

        <h2 style={{ marginTop: 28 }}>Local nutrition model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/glp1-nutrition/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Nutrition inputs</h2>
              <p className="tool-description">Enter body profile, medication context, and activity level for source target estimates.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="glp1-nutrition-weight">
              Weight (kg)
              <input className="input" id="glp1-nutrition-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-height">
              Height (cm)
              <input className="input" id="glp1-nutrition-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} step="0.1" type="number" value={values.heightCm} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-age">
              Age
              <input className="input" id="glp1-nutrition-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={values.age} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-sex">
              Sex
              <select className="input" id="glp1-nutrition-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as Glp1NutritionSex }))} value={values.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-medication">
              GLP-1 medication
              <select className="input" id="glp1-nutrition-medication" onChange={(event) => setValues((current) => ({ ...current, medication: event.target.value as Glp1Medication }))} value={values.medication}>
                {(Object.keys(glp1MedicationLabels) as Glp1Medication[]).map((key) => (
                  <option key={key} value={key}>
                    {glp1MedicationLabels[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-activity">
              Activity level
              <select className="input" id="glp1-nutrition-activity" onChange={(event) => updateNumber("activityFactor", event.target.value)} value={values.activityFactor}>
                {Object.entries(glp1ActivityLabels).map(([factor, label]) => (
                  <option key={factor} value={factor}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save nutrition plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate nutrition targets
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Nutrition targets</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show minimum targets and activity context."}</p>
            </div>
            <span className="badge warn">Medical nutrition</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCalorieFloor ?? "0 kcal"}</strong>
              <span>Calorie floor</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>Protein</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWater ?? "0 ml"}</strong>
              <span>Hydration</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFiber ?? "0 g"}</strong>
              <span>Fiber</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            <div className="profile-row">
              <span>BMR</span>
              <strong>{result?.formattedBmr ?? "0 kcal"}</strong>
            </div>
            <div className="profile-row">
              <span>Medication</span>
              <strong>{result?.medicationLabel ?? glp1MedicationLabels[values.medication]}</strong>
            </div>
            <div className="profile-row">
              <span>Activity</span>
              <strong>{result?.activityLabel ?? glp1ActivityLabels[String(values.activityFactor)]}</strong>
            </div>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? "Use targets as a clinician-supervised floor, not a diet prescription." : "Waiting for calculation"}</strong>
              <small>{result ? "Escalate persistent nausea, very low intake, rapid weakness, or dehydration symptoms to a clinician." : "Calculate first to build the target summary."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Medication notes</h2>
        <div className="remediation-list">
          {medicationNotes.map((item, index) => (
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
          <p>Nutrition inputs stay local. Results are educational and should not replace advice from a healthcare provider.</p>
        </div>
      </aside>
    </div>
  );
}
