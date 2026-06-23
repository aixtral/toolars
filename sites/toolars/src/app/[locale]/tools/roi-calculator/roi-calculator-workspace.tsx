"use client";
import { useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateRoi,
  defaultRoiScenario,
  type RoiInput,
  type RoiResult
} from "@/lib/tools/roi-calculator";

const trustRows = [
  ["Local", "Cost and final value stay in this browser session", "local"],
  ["Context", "ROI needs time horizon, risk, and fee context", "warn"],
  ["Private", "Save only stores the ROI case locally when you choose it", ""]
] as const;

const comparisonNotes = [
  "VitalCalc ROI equals final value minus cost, divided by investment cost.",
  "ROI is a total return measure and does not annualize the result by itself.",
  "Compare ROI with time horizon, risk, taxes, fees, liquidity, and opportunity cost."
];

export function RoiCalculatorWorkspace() {
  const t = useTranslations("tools.roi-calculator");
  const [plan, setPlan] = useState<RoiInput>(defaultRoiScenario);
  const [result, setResult] = useState<RoiResult | null>(null);

  const calculate = () => {
    setResult(calculateRoi(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.roi-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RoiInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="roi-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc return workspace</span>
        <h1>ROI Calculator</h1>
        <p className="subtitle">Calculate return on investment percentage and net profit or loss.</p>

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
          <a className="button button-outline" href="/tools/roi-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Return inputs</h2>
              <p className="tool-description">Use investment cost and final value to calculate total ROI.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="roi-cost">
              Investment cost
              <input className="input" id="roi-cost" min={0} onChange={(event) => updateNumber("investmentCost", event.target.value)} step="1" type="number" value={plan.investmentCost} />
            </label>
            <label className="field-label" htmlFor="roi-value">
              Final value
              <input className="input" id="roi-value" min={0} onChange={(event) => updateNumber("finalValue", event.target.value)} step="1" type="number" value={plan.finalValue} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> Save ROI case
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate ROI
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>ROI summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see ROI and net profit."}</p>
            </div>
            <span className={`badge ${result?.resultTone === "loss" ? "warn" : "local"}`}>{result?.resultTone ?? "ROI"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRoi ?? "0.00%"}</strong>
              <span>Return on investment</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProfit ?? "$0"}</strong>
              <span>Net profit</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCost ?? "$0"}</strong>
              <span>Investment cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFinalValue ?? "$0"}</strong>
              <span>Final value</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? "ROI result ready" : "Waiting for calculation"}</strong>
              <small>{result ? "Total ROI does not include duration unless you add that context." : "Calculate first to compare cost and final value."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Comparison notes</h2>
        <div className="remediation-list">
          {comparisonNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Context first
          </strong>
          <p>Pair ROI with time horizon, risk, and fee assumptions before using it for decisions.</p>
        </div>
      </aside>
    </div>
  );
}
