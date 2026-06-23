"use client";
import { useTranslations } from "next-intl";

import { Calculator, Ruler, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { calculateWaistHipRatio, defaultWaistHipScenario, type WaistHipInput, type WaistHipResult, type WaistHipSex } from "@/lib/tools/waist-hip-ratio";

const trustRows = [
  ["Local", "Waist and hip measurements stay in this browser session", "local"],
  ["Reference", "WHR categories are informational and not diagnostic", "warn"],
  ["Private", "Save only stores the local measurement sample when you choose it", ""]
] as const;

const whrNotes = [
  "VitalCalc WHR equals waist circumference divided by hip circumference.",
  "Measure waist at navel level and hips at the widest point with the tape level.",
  "Abdominal-risk interpretation depends on broader clinical context, not WHR alone."
];

export function WaistHipRatioWorkspace() {
  const t = useTranslations("tools.waist-hip-ratio");
  const [measurements, setMeasurements] = useState<WaistHipInput>(() => defaultWaistHipScenario);
  const [result, setResult] = useState<WaistHipResult | null>(null);

  const calculate = () => {
    setResult(calculateWaistHipRatio(measurements));
  };

  const saveMeasurements = () => {
    try {
      window.localStorage.setItem("toolars.waist-hip-ratio.measurements", JSON.stringify(measurements));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<WaistHipInput, "waistCm" | "hipCm">, value: string) => {
    setMeasurements((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: WaistHipSex) => {
    setMeasurements((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="waist-hip-ratio">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc body measurement workspace</span>
        <h1>Waist-to-Hip Ratio Calculator</h1>
        <p className="subtitle">Calculate waist-to-hip ratio locally and map it to sex-specific reference categories.</p>

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
          <a className="button button-outline" href="/tools/waist-hip-ratio/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Measurement inputs</h2>
              <p className="tool-description">Use centimeter measurements from the VitalCalc WHR source.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="whr-sex">
              Sex
              <select className="input" id="whr-sex" onChange={(event) => updateSex(event.target.value as WaistHipSex)} value={measurements.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="whr-waist">
              Waist (cm)
              <input className="input" id="whr-waist" min={0} onChange={(event) => updateNumber("waistCm", event.target.value)} type="number" value={measurements.waistCm} />
            </label>
            <label className="field-label" htmlFor="whr-hip">
              Hip (cm)
              <input className="input" id="whr-hip" min={0} onChange={(event) => updateNumber("hipCm", event.target.value)} type="number" value={measurements.hipCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveMeasurements} type="button">
              <Save size={16} aria-hidden="true" /> Save measurements
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate WHR
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>WHR summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see waist-to-hip ratio and reference risk category."}</p>
            </div>
            <span className="badge warn">{result?.thresholdLabel ?? "Reference"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRatio ?? "0.00"}</strong>
              <span>Waist-to-hip ratio</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? "Pending"}</strong>
              <span>Reference category</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWaist ?? "0 cm"}</strong>
              <span>Waist</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedHip ?? "0 cm"}</strong>
              <span>Hip</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Ruler size={18} aria-hidden="true" />
            <span>
              <strong>{result?.tip ?? "Waiting for calculation"}</strong>
              <small>{result ? "Use the same measurement method when tracking over time." : "Calculate first to review WHR context."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>WHR notes</h2>
        <div className="remediation-list">
          {whrNotes.map((item, index) => (
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
          <p>WHR measurements stay private and should be treated as reference-only health context.</p>
        </div>
      </aside>
    </div>
  );
}
