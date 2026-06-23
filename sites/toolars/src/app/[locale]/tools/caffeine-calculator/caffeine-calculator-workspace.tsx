"use client";
import { useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  caffeineDrinks,
  calculateCaffeineLimit,
  defaultCaffeineScenario,
  type CaffeineDrinkId,
  type CaffeineInput,
  type CaffeineResult
} from "@/lib/tools/caffeine-calculator";

const storageKey = "toolars.caffeine-calculator.plan:v1";

const trustRows = [
  ["Local", "Weight and drink choices stay in this browser session", "local"],
  ["Timing", "Sleep impact varies by metabolism and timing", "warn"],
  ["Private", "Save stores only this caffeine sample locally", ""]
] as const;

const caffeineNotes = [
  "VitalCalc uses 5.7 mg per kg with a 400 mg daily adult cap.",
  "Pregnancy mode applies the source 50% weight adjustment and 200 mg cap.",
  "Medication, sleep timing, anxiety, pregnancy, and individual tolerance can change safe intake."
];

export function CaffeineCalculatorWorkspace() {
  const t = useTranslations("tools.caffeine-calculator");
  const [values, setValues] = useState<CaffeineInput>(() => defaultCaffeineScenario);
  const [result, setResult] = useState<CaffeineResult | null>(null);

  const calculate = () => {
    setResult(calculateCaffeineLimit(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateWeight = (value: string) => {
    setValues((current) => ({ ...current, weightKg: Number(value) }));
    setResult(null);
  };

  const updatePregnancy = (value: string) => {
    setValues((current) => ({ ...current, pregnant: value === "yes" }));
    setResult(null);
  };

  const toggleDrink = (drinkId: CaffeineDrinkId) => {
    setValues((current) => {
      const selected = current.selectedDrinkIds.includes(drinkId) ? current.selectedDrinkIds.filter((id) => id !== drinkId) : [...current.selectedDrinkIds, drinkId];
      return { ...current, selectedDrinkIds: selected };
    });
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="caffeine-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc caffeine workspace</span>
        <h1>Caffeine Safe Limit Calculator</h1>
        <p className="subtitle">Calculate a daily caffeine allowance from weight, pregnancy status, and selected drink sources.</p>

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
          <a className="button button-outline" href="/tools/caffeine-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Caffeine inputs</h2>
              <p className="tool-description">Use source allowance caps and common drink caffeine references.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="caffeine-weight">
              Weight (kg)
              <input className="input" id="caffeine-weight" min={0} onChange={(event) => updateWeight(event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="caffeine-pregnant">
              Pregnant
              <select className="input" id="caffeine-pregnant" onChange={(event) => updatePregnancy(event.target.value)} value={values.pregnant ? "yes" : "no"}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
          </div>

          <div className="workspace-section-title">
            <div>
              <h2>Today's drinks</h2>
              <p className="tool-description">Select any sources already consumed today.</p>
            </div>
          </div>
          <div className="profile-list">
            {caffeineDrinks.map((drink) => (
              <label className="profile-row" htmlFor={`caffeine-drink-${drink.id}`} key={drink.id}>
                <input checked={values.selectedDrinkIds.includes(drink.id)} id={`caffeine-drink-${drink.id}`} onChange={() => toggleDrink(drink.id)} type="checkbox" />
                <span>{drink.label}</span>
                <strong>{drink.mg} mg</strong>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
              <Save size={16} aria-hidden="true" /> Save caffeine plan
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate safe limit
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Allowance summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show safe limit and remaining allowance."}</p>
            </div>
            <span className="badge warn">{result?.status ?? "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedDailyLimit ?? "0 mg"}</strong>
              <span>Daily safe limit</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedConsumed ?? "0 mg"}</strong>
              <span>Consumed</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRemaining ?? "0 mg"}</strong>
              <span>Remaining</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.limitText ?? "Pending"}</strong>
              <span>Limit mode</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result?.status ?? "Waiting for calculation"}</strong>
              <small>{result ? "Caffeine half-life is commonly around five hours." : "Calculate first to review intake and remaining allowance."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Caffeine notes</h2>
        <div className="remediation-list">
          {caffeineNotes.map((item, index) => (
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
          <p>Caffeine intake assumptions stay in this browser and are not sent to a provider.</p>
        </div>
      </aside>
    </div>
  );
}
