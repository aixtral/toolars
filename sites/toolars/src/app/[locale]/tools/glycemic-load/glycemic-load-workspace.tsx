"use client";
import { useTranslations } from "next-intl";

import { Calculator, Droplet, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateGlycemicLoad,
  defaultGlycemicLoadScenario,
  getGlycemicFood,
  glycemicFoods,
  type GlycemicFoodId,
  type GlycemicLoadInput,
  type GlycemicLoadResult
} from "@/lib/tools/glycemic-load";

const storageKey = "toolars.glycemic-load.sample:v1";

const trustRows = [
  ["Local", "Food and serving values stay in this browser session", "local"],
  ["Diet", "GL is food-context guidance, not medical advice", "warn"],
  ["Private", "Save stores only this food sample locally", ""]
] as const;

const glycemicNotes = [
  "VitalCalc calculates GL as glycemic index times carbs per serving divided by 100.",
  "GL <= 10 is low, 11-19 is medium, and 20 or higher is high.",
  "Blood sugar response depends on meal composition, medication, activity, and individual metabolism."
];

export function GlycemicLoadWorkspace() {
  const t = useTranslations("tools.glycemic-load");
  const [values, setValues] = useState<GlycemicLoadInput>(() => defaultGlycemicLoadScenario);
  const [result, setResult] = useState<GlycemicLoadResult | null>(null);

  const calculate = () => {
    setResult(calculateGlycemicLoad(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateFood = (foodId: GlycemicFoodId) => {
    const food = getGlycemicFood(foodId);
    setValues({
      foodId,
      servingGrams: food.defaultServingGrams,
      glycemicIndex: food.glycemicIndex,
      carbsPer100g: food.carbsPer100g
    });
    setResult(null);
  };

  const updateNumber = (key: keyof Pick<GlycemicLoadInput, "servingGrams" | "glycemicIndex" | "carbsPer100g">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="glycemic-load">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc glycemic workspace</span>
        <h1>Glycemic Load Calculator</h1>
        <p className="subtitle">Estimate a food portion's glycemic load from GI, carbohydrate density, and serving size.</p>

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
          <a className="button button-outline" href="/tools/glycemic-load/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Food inputs</h2>
              <p className="tool-description">Use a source food reference or enter custom GI and carbs.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="glycemic-food">
              Food
              <select className="input" id="glycemic-food" onChange={(event) => updateFood(event.target.value as GlycemicFoodId)} value={values.foodId}>
                {glycemicFoods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="glycemic-serving">
              Serving size (g)
              <input className="input" id="glycemic-serving" min={0} onChange={(event) => updateNumber("servingGrams", event.target.value)} step="1" type="number" value={values.servingGrams} />
            </label>
            <label className="field-label" htmlFor="glycemic-gi">
              Glycemic Index (GI)
              <input className="input" id="glycemic-gi" min={0} onChange={(event) => updateNumber("glycemicIndex", event.target.value)} step="1" type="number" value={values.glycemicIndex} />
            </label>
            <label className="field-label" htmlFor="glycemic-carbs">
              Carbs per 100g
              <input className="input" id="glycemic-carbs" min={0} onChange={(event) => updateNumber("carbsPer100g", event.target.value)} step="0.1" type="number" value={values.carbsPer100g} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save food sample
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate glycemic load
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Glycemic summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show GL category and blood-sugar impact."}</p>
            </div>
            <span className="badge warn">{result?.category ?? "GL bands"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedGlycemicLoad ?? "0.0"}</strong>
              <span>Glycemic load</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalCarbs ?? "0.0 g"}</strong>
              <span>Total carbs</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? "Pending"}</strong>
              <span>GL category</span>
            </article>
            <article className="llm-metric">
              <strong>{values.glycemicIndex}</strong>
              <span>Glycemic index</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplet size={18} aria-hidden="true" />
            <span>
              <strong>{result?.impact ?? "Waiting for calculation"}</strong>
              <small>{result ? "Pair GL with overall meal context and professional advice when needed." : "Calculate first to review the food impact band."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Glycemic load notes</h2>
        <div className="remediation-list">
          {glycemicNotes.map((item, index) => (
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
          <p>Food inputs stay local and are meant for practical nutrition planning, not diagnosis.</p>
        </div>
      </aside>
    </div>
  );
}
