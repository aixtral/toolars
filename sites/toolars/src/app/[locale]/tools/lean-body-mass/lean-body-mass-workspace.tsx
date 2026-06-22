"use client";

import { Calculator, Save, Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateLeanBodyMass, defaultLeanBodyMassScenario, type LeanBodyMassInput, type LeanBodyMassResult } from "@/lib/tools/lean-body-mass";

const trustRows = [
  ["Local", "Weight and body-fat assumptions stay in this browser session", "local"],
  ["Reference", "Lean body mass depends on the body-fat method used", "warn"],
  ["Private", "Save only stores composition assumptions locally", ""]
] as const;

const compositionNotes = [
  "Lean body mass equals total weight minus estimated fat mass.",
  "Use the same body-fat method over time for better trend comparison.",
  "Hydration and measurement error can move short-term body-composition readings."
];

export function LeanBodyMassWorkspace() {
  const [composition, setComposition] = useState<LeanBodyMassInput>(defaultLeanBodyMassScenario);
  const [result, setResult] = useState<LeanBodyMassResult | null>(null);

  const calculate = () => {
    setResult(calculateLeanBodyMass(composition));
  };

  const saveComposition = () => {
    window.localStorage.setItem("toolars.lean-body-mass.composition", JSON.stringify(composition));
  };

  const updateNumber = (key: keyof LeanBodyMassInput, value: string) => {
    setComposition((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="lean-body-mass">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc body composition workspace</span>
        <h1>Lean Body Mass Calculator</h1>
        <p className="subtitle">Calculate lean mass from weight and body fat percentage.</p>

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
          <a className="button button-outline" href="/tools/lean-body-mass/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Composition inputs</h2>
              <p className="tool-description">Use body weight and body fat percentage from the same measurement method.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="lean-weight">
              Weight (kg)
              <input className="input" id="lean-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={composition.weightKg} />
            </label>
            <label className="field-label" htmlFor="lean-body-fat">
              Body fat (%)
              <input className="input" id="lean-body-fat" min={0} onChange={(event) => updateNumber("bodyFatPercent", event.target.value)} step="0.1" type="number" value={composition.bodyFatPercent} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveComposition} type="button">
              <Save size={16} aria-hidden="true" /> Save composition
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate lean mass
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lean mass result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate lean and fat mass."}</p>
            </div>
            <span className="badge warn">Reference</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedLeanBodyMass ?? "0.0 kg"}</strong>
              <span>Lean body mass</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatMass ?? "0.0 kg"}</strong>
              <span>Fat mass</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLeanMassRatio ?? "0.0%"}</strong>
              <span>Lean mass ratio</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Scale size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use trend data, not a single snapshot, for body composition decisions." : "Calculate first to get the composition split."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Composition notes</h2>
        <div className="remediation-list">
          {compositionNotes.map((item, index) => (
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
          <p>No account data is required. Lean mass results are body-composition estimates, not clinical measurements.</p>
        </div>
      </aside>
    </div>
  );
}
