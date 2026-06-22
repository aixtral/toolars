"use client";

import { Activity, Calculator, Download, Save, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  calculateBmi,
  defaultBmiProfile,
  type BmiInput,
  type BmiResult
} from "@/lib/tools/bmi-calculator";

const trustRows = [
  ["Local", "Height and weight stay in this browser session", "local"],
  ["Reference", "BMI is informational, not diagnostic", ""],
  ["Privacy", "Save only when you choose local profile storage", ""]
] as const;

const healthNotes = [
  "BMI is a screening reference and does not measure body composition directly.",
  "Athletes, older adults, and pregnancy contexts need additional interpretation.",
  "Saved outputs should include metric units, date, and any caveats shown with the result."
];

export function BmiCalculatorWorkspace() {
  const t = useTranslations("tools.bmi-calculator");
  const [profile, setProfile] = useState<BmiInput>(defaultBmiProfile);
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculate = () => {
    setResult(calculateBmi(profile));
  };

  const saveProfile = () => {
    window.localStorage.setItem("toolars.bmi-calculator.profile", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof BmiInput, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bmi-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc health workspace</span>
        <h1>BMI Calculator</h1>
        <p className="subtitle">
          Calculate body mass index locally and keep medical caveats close to the result.
        </p>

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
          <a className="button button-outline" href="/tools/bmi-calculator/about">Tool details</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Body metrics</h2>
              <p className="tool-description">Use metric inputs for a quick local BMI reference.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="bmi-height">
              Height
              <input
                className="input"
                id="bmi-height"
                min={1}
                onChange={(event) => updateNumber("heightCm", event.target.value)}
                type="number"
                value={profile.heightCm}
              />
            </label>
            <label className="field-label" htmlFor="bmi-weight">
              Weight
              <input
                className="input"
                id="bmi-weight"
                min={1}
                onChange={(event) => updateNumber("weightKg", event.target.value)}
                type="number"
                value={profile.weightKg}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveProfile}>
              <Save size={16} aria-hidden="true" /> Save profile
            </button>
            <button className="button button-solid" type="button" onClick={calculate}>
              <Calculator size={16} aria-hidden="true" /> Calculate BMI
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>BMI result</h2>
              <p className="tool-description">{result ? `${result.formattedBmi} BMI` : "Run calculation to estimate body mass index."}</p>
            </div>
            <button className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> Export note
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? "0.0"}</strong>
              <span>BMI</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`category.${result.category}.label`) : "Pending"}</strong>
              <span>Reference category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.healthyWeightRange ?? "0.0-0.0 kg"}</strong>
              <span>Healthy weight range</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.inputSummary ?? "175 cm / 70 kg"}</strong>
              <span>Input summary</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`category.${result.category}.recommendation`) : "Waiting for calculation"}</strong>
              <small>{result ? "Use BMI as a screening reference alongside broader health context." : "Calculate first to classify the reference range."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Health reference notes</h2>
        <div className="remediation-list">
          {healthNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong><ShieldCheck size={16} aria-hidden="true" /> Local-first</strong>
          <p>No account storage is required. BMI results are references and should not be treated as a diagnosis.</p>
        </div>
      </aside>
    </div>
  );
}
