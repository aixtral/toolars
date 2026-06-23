"use client";
import { useTranslations } from "next-intl";

import { Calculator, MapPin, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateCityCostComparison,
  defaultCityCostComparisonScenario,
  type CityCostComparisonInput,
  type CityCostComparisonResult,
  type CityCostInputs
} from "@/lib/tools/city-cost-comparison";

const trustRows = [
  ["Local", "Income and city costs stay in this browser session", "local"],
  ["Scenario", "Relocation output depends on user-entered assumptions", "warn"],
  ["Private", "Save only stores the comparison locally when you choose it", ""]
] as const;

const relocationNotes = [
  "VitalCalc estimates monthly federal tax first, then compares monthly surplus across cities.",
  "Cost fields are user-entered averages for rent, food, transport, and entertainment or other spend.",
  "Moving costs, salary changes, benefits, family needs, and quality of life can outweigh the surplus gap."
];

export function CityCostComparisonWorkspace() {
  const t = useTranslations("tools.city-cost-comparison");
  const [plan, setPlan] = useState<CityCostComparisonInput>(defaultCityCostComparisonScenario);
  const [result, setResult] = useState<CityCostComparisonResult | null>(null);

  const calculate = () => {
    setResult(calculateCityCostComparison(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.city-cost-comparison.plan", JSON.stringify(plan));
  };

  const updateIncome = (value: string) => {
    setPlan((current) => ({ ...current, monthlyIncome: Number(value) }));
    setResult(null);
  };

  const updateCity = (city: "cityA" | "cityB", key: keyof CityCostInputs, value: string) => {
    setPlan((current) => ({
      ...current,
      [city]: {
        ...current[city],
        [key]: Number(value)
      }
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="city-cost-comparison">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc relocation workspace</span>
        <h1>City Cost Comparison</h1>
        <p className="subtitle">Compare city-by-city spending and monthly surplus before making a relocation decision.</p>

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
          <a className="button button-outline" href="/tools/city-cost-comparison/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>City assumptions</h2>
              <p className="tool-description">Use monthly income and comparable city cost buckets.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="city-income">
              Monthly pre-tax income
              <input className="input" id="city-income" min={0} onChange={(event) => updateIncome(event.target.value)} step="100" type="number" value={plan.monthlyIncome} />
            </label>
            <label className="field-label" htmlFor="city-a-rent">
              City A rent
              <input className="input" id="city-a-rent" min={0} onChange={(event) => updateCity("cityA", "rent", event.target.value)} step="100" type="number" value={plan.cityA.rent} />
            </label>
            <label className="field-label" htmlFor="city-a-food">
              City A food
              <input className="input" id="city-a-food" min={0} onChange={(event) => updateCity("cityA", "food", event.target.value)} step="50" type="number" value={plan.cityA.food} />
            </label>
            <label className="field-label" htmlFor="city-a-transport">
              City A transport
              <input className="input" id="city-a-transport" min={0} onChange={(event) => updateCity("cityA", "transport", event.target.value)} step="50" type="number" value={plan.cityA.transport} />
            </label>
            <label className="field-label" htmlFor="city-a-other">
              City A other
              <input className="input" id="city-a-other" min={0} onChange={(event) => updateCity("cityA", "other", event.target.value)} step="50" type="number" value={plan.cityA.other} />
            </label>
            <label className="field-label" htmlFor="city-b-rent">
              City B rent
              <input className="input" id="city-b-rent" min={0} onChange={(event) => updateCity("cityB", "rent", event.target.value)} step="100" type="number" value={plan.cityB.rent} />
            </label>
            <label className="field-label" htmlFor="city-b-food">
              City B food
              <input className="input" id="city-b-food" min={0} onChange={(event) => updateCity("cityB", "food", event.target.value)} step="50" type="number" value={plan.cityB.food} />
            </label>
            <label className="field-label" htmlFor="city-b-transport">
              City B transport
              <input className="input" id="city-b-transport" min={0} onChange={(event) => updateCity("cityB", "transport", event.target.value)} step="50" type="number" value={plan.cityB.transport} />
            </label>
            <label className="field-label" htmlFor="city-b-other">
              City B other
              <input className="input" id="city-b-other" min={0} onChange={(event) => updateCity("cityB", "other", event.target.value)} step="50" type="number" value={plan.cityB.other} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save city comparison
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Compare cities
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Relocation summary</h2>
              <p className="tool-description">{result ? result.summary : "Run comparison to review surplus and annual difference."}</p>
            </div>
            <span className={`badge ${result?.winner === "tie" ? "" : "local"}`}>{result?.winner ?? "Compare"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCityASurplus ?? "$0"}</strong>
              <span>City A monthly surplus</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCityBSurplus ?? "$0"}</strong>
              <span>City B monthly surplus</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualDifference ?? "$0"}</strong>
              <span>Annual difference</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNetMonthlyIncome ?? "$0"}</strong>
              <span>After-tax monthly income</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <MapPin size={18} aria-hidden="true" />
            <span>
              <strong>{result?.winnerTitle ?? "Waiting for comparison"}</strong>
              <small>{result?.winnerText ?? "Compare first to see which city leaves more monthly surplus."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Relocation notes</h2>
        <div className="remediation-list">
          {relocationNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Scenario caveat
          </strong>
          <p>Use the comparison as planning math; validate with real offers, leases, taxes, and moving costs.</p>
        </div>
      </aside>
    </div>
  );
}
