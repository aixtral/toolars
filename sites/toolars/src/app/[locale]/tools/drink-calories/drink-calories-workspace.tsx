"use client";
import { useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateDrinkCalories,
  defaultDrinkCaloriesScenario,
  drinkCaloriesReferences,
  type DrinkCaloriesId,
  type DrinkCaloriesInput,
  type DrinkCaloriesResult
} from "@/lib/tools/drink-calories";

const storageKey = "toolars.drink-calories.plan:v1";

const trustRows = [
  ["Local", "Drink choices stay in this browser session", "local"],
  ["Nutrition", "Vendor recipes and portion sizes vary", "warn"],
  ["Private", "Save stores only this drink plan locally", ""]
] as const;

const drinkNotes = [
  "VitalCalc uses calories and sugar per 100ml from common beverage references.",
  "Steps to burn uses the source estimate of about 0.05 kcal per step.",
  "WHO recommends keeping added sugar around 25g per day; many sweet drinks exceed that alone."
];

export function DrinkCaloriesWorkspace() {
  const t = useTranslations("tools.drink-calories");
  const [values, setValues] = useState<DrinkCaloriesInput>(() => defaultDrinkCaloriesScenario);
  const [result, setResult] = useState<DrinkCaloriesResult | null>(null);

  const calculate = () => {
    setResult(calculateDrinkCalories(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<DrinkCaloriesInput, "servingSizeMl" | "cups" | "customCaloriesPer100Ml" | "customSugarPer100Ml">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="drink-calories">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc drink nutrition workspace</span>
        <h1>Drink Calories Calculator</h1>
        <p className="subtitle">Estimate liquid calories, sugar, steps to burn, and daily calorie percentage.</p>

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
          <a className="button button-outline" href="/tools/drink-calories/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Drink inputs</h2>
              <p className="tool-description">Use source drink references, serving size, and cups today.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="drink-calories-type">
              Drink type
              <select className="input" id="drink-calories-type" onChange={(event) => setValues((current) => ({ ...current, drinkId: event.target.value as DrinkCaloriesId }))} value={values.drinkId}>
                {drinkCaloriesReferences.map((drink) => (
                  <option key={drink.id} value={drink.id}>
                    {drink.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="drink-calories-size">
              Serving size (ml)
              <input className="input" id="drink-calories-size" min={0} onChange={(event) => updateNumber("servingSizeMl", event.target.value)} step="1" type="number" value={values.servingSizeMl} />
            </label>
            <label className="field-label" htmlFor="drink-calories-cups">
              Cups drank today
              <input className="input" id="drink-calories-cups" min={0} onChange={(event) => updateNumber("cups", event.target.value)} step="0.5" type="number" value={values.cups} />
            </label>
            <label className="field-label" htmlFor="drink-custom-calories">
              Custom kcal / 100ml
              <input className="input" id="drink-custom-calories" min={0} onChange={(event) => updateNumber("customCaloriesPer100Ml", event.target.value)} step="1" type="number" value={values.customCaloriesPer100Ml} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save drink plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate calories
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Liquid calorie summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show today's drink calories and sugar."}</p>
            </div>
            <span className="badge warn">Sugar reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalCalories ?? "0 kcal"}</strong>
              <span>Total calories</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSugar ?? "0 g"}</strong>
              <span>Sugar</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSteps ?? "--"}</strong>
              <span>Steps to burn</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDailyPercent ?? "0.0%"}</strong>
              <span>Daily calories</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result?.tip ?? "Waiting for calculation"}</strong>
              <small>{result?.perCupDescription ?? "Calculate first to review beverage assumptions."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Drink calorie notes</h2>
        <div className="remediation-list">
          {drinkNotes.map((item, index) => (
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
          <p>Drink plans stay local and can be paired with calorie deficit or glycemic tools.</p>
        </div>
      </aside>
    </div>
  );
}
