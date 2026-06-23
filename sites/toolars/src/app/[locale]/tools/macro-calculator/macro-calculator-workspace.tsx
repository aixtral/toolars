"use client";
import { useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateMacros, defaultMacroScenario, macroPresets, type MacroGoal, type MacroInput, type MacroResult } from "@/lib/tools/macro-calculator";

const trustRows = [
  ["Local", "Calories, weight, and macro goal stay in this browser session", "local"],
  ["Reference", "Macro presets are planning splits, not diet prescriptions", "warn"],
  ["Private", "Save only stores the split locally when you choose it", ""]
] as const;

const macroNotes = [
  "Protein and carbs use 4 kcal/g; fat uses 9 kcal/g.",
  "High-protein mode preserves the VitalCalc minimum of 1.6 g/kg when needed.",
  "Training days, rest days, appetite, and medical needs can require different splits."
];

export function MacroCalculatorWorkspace() {
  const t = useTranslations("tools.macro-calculator");
  const [split, setSplit] = useState<MacroInput>(defaultMacroScenario);
  const [result, setResult] = useState<MacroResult | null>(null);

  const calculate = () => {
    setResult(calculateMacros(split));
  };

  const saveSplit = () => {
    window.localStorage.setItem("toolars.macro-calculator.split", JSON.stringify(split));
  };

  const updateNumber = (key: keyof Pick<MacroInput, "calories" | "weightKg">, value: string) => {
    setSplit((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateGoal = (value: MacroGoal) => {
    setSplit((current) => ({ ...current, goal: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="macro-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc nutrition workspace</span>
        <h1>Macro Calculator</h1>
        <p className="subtitle">Convert a calorie target into protein, carbohydrate, and fat grams.</p>

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
          <a className="button button-outline" href="/tools/macro-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Macro inputs</h2>
              <p className="tool-description">Use daily calories, body weight, and a VitalCalc diet preset.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="macro-calories">
              Daily calorie target
              <input className="input" id="macro-calories" min={0} onChange={(event) => updateNumber("calories", event.target.value)} type="number" value={split.calories} />
            </label>
            <label className="field-label" htmlFor="macro-weight">
              Weight (kg)
              <input className="input" id="macro-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={split.weightKg} />
            </label>
            <label className="field-label" htmlFor="macro-goal">
              Diet goal
              <select className="input" id="macro-goal" onChange={(event) => updateGoal(event.target.value as MacroGoal)} value={split.goal}>
                {macroPresets.map((preset) => (
                  <option key={preset.goal} value={preset.goal}>
                    {preset.label} (P{preset.proteinPercent}% C{preset.carbsPercent}% F{preset.fatPercent}%)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSplit} type="button">
              <Save size={16} aria-hidden="true" /> Save macro split
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate macros
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Macro result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate grams by macro."}</p>
            </div>
            <span className="badge warn">{result?.goalLabel ?? "Preset"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>Protein</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCarbs ?? "0 g"}</strong>
              <span>Carbs</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFat ?? "0 g"}</strong>
              <span>Fat</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result?.percentSummary ?? "Waiting for calculation"}</strong>
              <small>{result?.recommendation ?? "Calculate first to convert percentages into grams."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Macro notes</h2>
        <div className="remediation-list">
          {macroNotes.map((item, index) => (
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
          <p>No account data is required. Macro results are planning estimates, not clinical nutrition guidance.</p>
        </div>
      </aside>
    </div>
  );
}
