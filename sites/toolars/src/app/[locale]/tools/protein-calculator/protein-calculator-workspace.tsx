"use client";
import { useTranslations } from "next-intl";

import { Calculator, Dumbbell, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateProteinNeeds, defaultProteinScenario, proteinFactors, type ProteinInput, type ProteinResult } from "@/lib/tools/protein-calculator";

const trustRows = [
  ["Local", "Weight and goal factor stay in this browser session", "local"],
  ["Reference", "Protein targets are planning ranges, not medical nutrition therapy", "warn"],
  ["Private", "Save only stores the plan locally when you choose it", ""]
] as const;

const nutritionNotes = [
  "General adults often use 0.8-1.2 g/kg; training goals can use higher ranges.",
  "Spread intake across meals and choose sources that fit digestion and preference.",
  "Kidney disease, pregnancy, medication, or eating-disorder history need qualified care."
];

export function ProteinCalculatorWorkspace() {
  const t = useTranslations("tools.protein-calculator");
  const [plan, setPlan] = useState<ProteinInput>(defaultProteinScenario);
  const [result, setResult] = useState<ProteinResult | null>(null);

  const calculate = () => {
    setResult(calculateProteinNeeds(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.protein-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof ProteinInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="protein-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc nutrition workspace</span>
        <h1>Protein Calculator</h1>
        <p className="subtitle">Calculate daily protein needs from weight and activity or training goal.</p>

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
          <a className="button button-outline" href="/tools/protein-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Nutrition inputs</h2>
              <p className="tool-description">Use the VitalCalc sample body weight, then choose a protein factor.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="protein-weight">
              Weight (kg)
              <input className="input" id="protein-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="protein-factor">
              Activity or goal
              <select className="input" id="protein-factor" onChange={(event) => updateNumber("factor", event.target.value)} value={plan.factor}>
                {proteinFactors.map((factor) => (
                  <option key={factor.value} value={factor.value}>
                    {factor.label} ({factor.value} g/kg)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save protein plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate protein
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Protein result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate protein grams and food equivalents."}</p>
            </div>
            <span className="badge warn">{result?.factorLabel ?? "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>Daily target</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPerMeal ?? "0 g"}</strong>
              <span>Per meal</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEggs ?? "0 eggs"}</strong>
              <span>Egg equivalent</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedChicken ?? "0 g"}</strong>
              <span>Chicken breast</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Dumbbell size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use this as a daily target, then adapt by appetite and training response." : "Calculate first to get food equivalents."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Nutrition notes</h2>
        <div className="remediation-list">
          {nutritionNotes.map((item, index) => (
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
          <p>No account data is required. Protein results are planning estimates, not a clinical meal plan.</p>
        </div>
      </aside>
    </div>
  );
}
