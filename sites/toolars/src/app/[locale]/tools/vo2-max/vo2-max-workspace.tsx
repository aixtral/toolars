"use client";
import { useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateVo2Max,
  defaultVo2MaxScenario,
  vo2MethodOptions,
  type Vo2MaxInput,
  type Vo2MaxResult,
  type Vo2Method,
  type Vo2Sex
} from "@/lib/tools/vo2-max";

const storageKey = "toolars.vo2-max.test:v1";

const trustRows = [
  ["Local", "Fitness test inputs stay in this browser session", "local"],
  ["Training", "VO2 Max estimates depend on test quality and recovery state", "warn"],
  ["Private", "Save stores only this local fitness test", ""]
] as const;

const trainingNotes = [
  "VitalCalc source formula: Cooper VO2 = (distance(m) - 504.9) / 44.73.",
  "Female Cooper estimates use the source multiplier of 0.85.",
  "Resting HR method uses 15.3 x (208 - 0.7 x age) / resting HR."
];

export function Vo2MaxWorkspace() {
  const t = useTranslations("tools.vo2-max");
  const [test, setTest] = useState<Vo2MaxInput>(() => defaultVo2MaxScenario);
  const [result, setResult] = useState<Vo2MaxResult | null>(null);

  const calculate = () => {
    setResult(calculateVo2Max(test));
  };

  const saveTest = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(test));
    } catch {}
  };

  const updateTest = <Key extends keyof Vo2MaxInput>(key: Key, value: Vo2MaxInput[Key]) => {
    setTest((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="vo2-max">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc cardio workspace</span>
        <h1>VO2 Max Calculator</h1>
        <p className="subtitle">Estimate maximum oxygen uptake from a Cooper 12-minute run or resting heart rate sample.</p>

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
          <a className="button button-outline" href="/tools/vo2-max/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Fitness inputs</h2>
              <p className="tool-description">Choose the source method and enter test data from a controlled effort.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="vo2-method">
              Method
              <select className="input" id="vo2-method" onChange={(event) => updateTest("method", event.target.value as Vo2Method)} value={test.method}>
                {vo2MethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="vo2-distance">
              Distance (meters)
              <input className="input" id="vo2-distance" min={0} onChange={(event) => updateTest("distanceMeters", Number(event.target.value))} type="number" value={test.distanceMeters} />
            </label>
            <label className="field-label" htmlFor="vo2-sex">
              Sex
              <select className="input" id="vo2-sex" onChange={(event) => updateTest("sex", event.target.value as Vo2Sex)} value={test.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field-label" htmlFor="vo2-age">
              Age
              <input className="input" id="vo2-age" min={0} onChange={(event) => updateTest("age", Number(event.target.value))} type="number" value={test.age} />
            </label>
            <label className="field-label" htmlFor="vo2-resting-hr">
              Resting heart rate
              <input className="input" id="vo2-resting-hr" min={1} onChange={(event) => updateTest("restingHeartRate", Number(event.target.value))} type="number" value={test.restingHeartRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveTest} type="button">
              <Save size={16} aria-hidden="true" /> Save fitness test
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate VO2 Max
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>VO2 result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show VO2 Max, fitness level, and source reference bands."}</p>
            </div>
            <span className="badge warn">{result?.methodLabel ?? "Source formula"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedVo2Max ?? "0.0"}</strong>
              <span>ml/kg/min</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fitnessLevel ?? "--"}</strong>
              <span>Fitness level</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? (test.method === "cooper" ? "Cooper" : "Resting HR") : "--"}</strong>
              <span>Method</span>
            </article>
            <article className="llm-metric">
              <strong>{test.method === "cooper" ? `${test.distanceMeters} m` : `${test.restingHeartRate} bpm`}</strong>
              <span>Source input</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.referenceRows ?? []).map((row) => (
              <div className="profile-row" key={row.label}>
                <span className="badge">{row.label}</span>
                <span>{row.range}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Retest under similar conditions for trend comparisons." : "Calculate first to build the reference table."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Training notes</h2>
        <div className="remediation-list">
          {trainingNotes.map((item, index) => (
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
          <p>Fitness estimates stay local and should not replace medical clearance for hard exercise.</p>
        </div>
      </aside>
    </div>
  );
}
