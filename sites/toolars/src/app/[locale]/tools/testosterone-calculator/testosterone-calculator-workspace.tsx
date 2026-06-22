"use client";

import { Calculator, Save, ShieldCheck, TestTube2 } from "lucide-react";
import { useState } from "react";
import {
  calculateTestosterone,
  defaultTestosteroneScenario,
  type TestosteroneAlbuminUnit,
  type TestosteroneInput,
  type TestosteroneResult,
  type TestosteroneSex,
  type TestosteroneShbgUnit,
  type TestosteroneTotalUnit
} from "@/lib/tools/testosterone-calculator";

const storageKey = "toolars.testosterone-calculator.lab:v1";

const trustRows = [
  ["Local", "Lab values stay in this browser session", "local"],
  ["Medical", "Hormone values require lab timing, symptoms, and clinician context", "warn"],
  ["Private", "Save stores only these local lab inputs", ""]
] as const;

const clinicalNotes = [
  "VitalCalc source converts total testosterone from nmol/L to ng/dL with x 28.84.",
  "The source estimate uses total T and SHBG, then clamps negative free T to zero.",
  "This workspace is a reference view and does not diagnose hormone status."
];

export function TestosteroneCalculatorWorkspace() {
  const [lab, setLab] = useState<TestosteroneInput>(() => defaultTestosteroneScenario);
  const [result, setResult] = useState<TestosteroneResult | null>(null);

  const calculate = () => {
    setResult(calculateTestosterone(lab));
  };

  const saveLab = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lab));
    } catch {}
  };

  const updateLab = <Key extends keyof TestosteroneInput>(key: Key, value: TestosteroneInput[Key]) => {
    setLab((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="testosterone-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc lab workspace</span>
        <h1>Testosterone Calculator</h1>
        <p className="subtitle">Estimate free and bioavailable testosterone from total testosterone and SHBG using the VitalCalc source script.</p>

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
          <a className="button button-outline" href="/tools/testosterone-calculator/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Lab inputs</h2>
              <p className="tool-description">Enter the same fields exposed by the VitalCalc source page.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="testosterone-total">
              Total testosterone
              <input className="input" id="testosterone-total" min={0} onChange={(event) => updateLab("totalTestosterone", Number(event.target.value))} step="0.1" type="number" value={lab.totalTestosterone} />
            </label>
            <label className="field-label" htmlFor="testosterone-total-unit">
              Total unit
              <select className="input" id="testosterone-total-unit" onChange={(event) => updateLab("totalUnit", event.target.value as TestosteroneTotalUnit)} value={lab.totalUnit}>
                <option value="ngdl">ng/dL</option>
                <option value="nmoll">nmol/L</option>
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-shbg">
              SHBG
              <input className="input" id="testosterone-shbg" min={0} onChange={(event) => updateLab("shbg", Number(event.target.value))} step="0.1" type="number" value={lab.shbg} />
            </label>
            <label className="field-label" htmlFor="testosterone-shbg-unit">
              SHBG unit
              <select className="input" id="testosterone-shbg-unit" onChange={(event) => updateLab("shbgUnit", event.target.value as TestosteroneShbgUnit)} value={lab.shbgUnit}>
                <option value="nmoll">nmol/L</option>
                <option value="ngdl">ng/dL</option>
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-albumin">
              Albumin
              <input className="input" id="testosterone-albumin" min={0} onChange={(event) => updateLab("albumin", Number(event.target.value))} step="0.1" type="number" value={lab.albumin} />
            </label>
            <label className="field-label" htmlFor="testosterone-albumin-unit">
              Albumin unit
              <select className="input" id="testosterone-albumin-unit" onChange={(event) => updateLab("albuminUnit", event.target.value as TestosteroneAlbuminUnit)} value={lab.albuminUnit}>
                <option value="gdl">g/dL</option>
                <option value="gl">g/L</option>
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-sex">
              Sex
              <select className="input" id="testosterone-sex" onChange={(event) => updateLab("sex", event.target.value as TestosteroneSex)} value={lab.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveLab} type="button">
              <Save size={16} aria-hidden="true" /> Save lab values
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate testosterone
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Hormone result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show free T, bioavailable T, and source reference status."}</p>
            </div>
            <span className="badge warn">Reference only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFreeTestosterone ?? "0.0 ng/dL"}</strong>
              <span>Free testosterone</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBioavailableTestosterone ?? "0.0 ng/dL"}</strong>
              <span>Bioavailable T</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFreePercent ?? "0.00%"}</strong>
              <span>Free T percent</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.status ?? "--"}</strong>
              <span>Reference status</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TestTube2 size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? `Reference range: ${result.referenceRange}` : "Calculate first to compare against source reference ranges."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Clinical notes</h2>
        <div className="remediation-list">
          {clinicalNotes.map((item, index) => (
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
          <p>Hormone inputs stay local. Use a clinician for diagnosis, treatment changes, or symptom review.</p>
        </div>
      </aside>
    </div>
  );
}
