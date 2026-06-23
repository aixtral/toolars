"use client";
import { useTranslations } from "next-intl";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateHeartRateZones,
  defaultHeartRateZoneScenario,
  type HeartRateZoneInput,
  type HeartRateZoneResult
} from "@/lib/tools/heart-rate-zone";

const storageKey = "toolars.heart-rate-zone.profile:v1";

const trustRows = [
  ["Local", "Age and resting heart rate stay in this browser session", "local"],
  ["Training", "Karvonen zones are planning references, not medical limits", "warn"],
  ["Private", "Save stores only this zone profile locally", ""]
] as const;

const measurementNotes = [
  "VitalCalc uses max HR = 220 - age.",
  "Heart rate reserve is max HR minus resting HR.",
  "Target HR = resting HR + heart rate reserve x intensity."
];

export function HeartRateZoneWorkspace() {
  const t = useTranslations("tools.heart-rate-zone");
  const [profile, setProfile] = useState<HeartRateZoneInput>(() => defaultHeartRateZoneScenario);
  const [result, setResult] = useState<HeartRateZoneResult | null>(null);

  const calculate = () => {
    setResult(calculateHeartRateZones(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {}
  };

  const updateNumber = (key: keyof HeartRateZoneInput, value: string) => {
    setProfile((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="heart-rate-zone">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc training workspace</span>
        <h1>Heart Rate Zone Calculator</h1>
        <p className="subtitle">Calculate target heart-rate zones using age, resting heart rate, and the Karvonen model.</p>

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
          <a className="button button-outline" href="/tools/heart-rate-zone/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Training inputs</h2>
              <p className="tool-description">Use morning resting heart rate for the most stable zone estimate.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="heart-zone-age">
              Age
              <input className="input" id="heart-zone-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={profile.age} />
            </label>
            <label className="field-label" htmlFor="heart-zone-resting">
              Resting heart rate
              <input className="input" id="heart-zone-resting" min={0} onChange={(event) => updateNumber("restingHeartRate", event.target.value)} type="number" value={profile.restingHeartRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
              <Save size={16} aria-hidden="true" /> Save zone profile
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate zones
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Zone result</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to show heart-rate reserve and five target zones."}</p>
            </div>
            <span className="badge warn">Karvonen</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMaxHeartRate ?? "0 bpm"}</strong>
              <span>Max heart rate</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedHeartRateReserve ?? "0 bpm"}</strong>
              <span>Heart rate reserve</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.zones[1]?.formattedRange ?? "--"}</strong>
              <span>Fat burn</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.zones[4]?.formattedRange ?? "--"}</strong>
              <span>Maximum effort</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.zones ?? []).map((zone) => (
              <div className="profile-row" key={zone.label}>
                <span className="badge">{zone.intensityLabel}</span>
                <span>
                  <strong>{zone.label}</strong> - {zone.formattedRange}
                  <small style={{ display: "block", marginTop: 2 }}>{zone.description}</small>
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for calculation"}</strong>
              <small>{result ? "Pair zones with perceived exertion and training context." : "Calculate first to build the zone table."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Measurement notes</h2>
        <div className="remediation-list">
          {measurementNotes.map((item, index) => (
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
          <p>Zone data stays local and should be adjusted for medication, illness, and clinician advice.</p>
        </div>
      </aside>
    </div>
  );
}
