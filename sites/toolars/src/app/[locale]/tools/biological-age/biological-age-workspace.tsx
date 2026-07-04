"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Clock3, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateBiologicalAge,
  defaultBiologicalAgeScenario,
  type AlcoholFrequency,
  type BiologicalAgeInput,
  type BiologicalAgeResult,
  type SmokingStatus,
  type StressLevel
} from "@/lib/tools/biological-age";

const storageKey = "toolars.biological-age.sample:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const lifestyleNotes = ["model", "factors", "biomarkers"] as const;

export function BiologicalAgeWorkspace() {
  const t = useTranslations("tools.biological-age.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/biological-age/about", localeCode);
  const [sample, setSample] = useState(defaultBiologicalAgeScenario);
  const [result, setResult] = useState<BiologicalAgeResult | null>(null);

  const calculate = () => {
    setResult(calculateBiologicalAge(sample));
  };

  const saveSample = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(sample));
    } catch {}
  };

  const updateSample = <Key extends keyof BiologicalAgeInput>(key: Key, value: BiologicalAgeInput[Key]) => {
    setSample((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="biological-age">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={row.tone ? `badge ${row.tone}` : "badge"}>{t(`trustRows.${row.key}.label`)}</span>
              <span>{t(`trustRows.${row.key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={detailsHref}>
            {t("detailsLink")}
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputSection.title")}</h2>
              <p className="tool-description">{t("inputSection.description")}</p>
            </div>
            <span className="badge local">{t("badges.local")}</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="bio-age-age">
              {t("fields.chronologicalAge")}
              <input className="input" id="bio-age-age" min={18} onChange={(event) => updateSample("chronologicalAge", Number(event.target.value))} type="number" value={sample.chronologicalAge} />
            </label>
            <label className="field-label" htmlFor="bio-age-bmi">
              {t("fields.bmi")}
              <input className="input" id="bio-age-bmi" min={0} onChange={(event) => updateSample("bmi", Number(event.target.value))} step="0.1" type="number" value={sample.bmi} />
            </label>
            <label className="field-label" htmlFor="bio-age-sbp">
              {t("fields.systolicBp")}
              <input className="input" id="bio-age-sbp" min={0} onChange={(event) => updateSample("systolicBp", Number(event.target.value))} type="number" value={sample.systolicBp} />
            </label>
            <label className="field-label" htmlFor="bio-age-exercise">
              {t("fields.exerciseDays")}
              <input className="input" id="bio-age-exercise" max={7} min={0} onChange={(event) => updateSample("exerciseDays", Number(event.target.value))} type="number" value={sample.exerciseDays} />
            </label>
            <label className="field-label" htmlFor="bio-age-sleep">
              {t("fields.sleepHours")}
              <input className="input" id="bio-age-sleep" min={0} onChange={(event) => updateSample("sleepHours", Number(event.target.value))} step="0.5" type="number" value={sample.sleepHours} />
            </label>
            <label className="field-label" htmlFor="bio-age-smoking">
              {t("fields.smoking")}
              <select className="input" id="bio-age-smoking" onChange={(event) => updateSample("smoking", event.target.value as SmokingStatus)} value={sample.smoking}>
                <option value="no">{t("options.smoking.no")}</option>
                <option value="former">{t("options.smoking.former")}</option>
                <option value="yes">{t("options.smoking.yes")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bio-age-alcohol">
              {t("fields.alcohol")}
              <select className="input" id="bio-age-alcohol" onChange={(event) => updateSample("alcohol", event.target.value as AlcoholFrequency)} value={sample.alcohol}>
                <option value="never">{t("options.alcohol.never")}</option>
                <option value="rare">{t("options.alcohol.rare")}</option>
                <option value="weekly">{t("options.alcohol.weekly")}</option>
                <option value="daily">{t("options.alcohol.daily")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bio-age-stress">
              {t("fields.stress")}
              <select className="input" id="bio-age-stress" onChange={(event) => updateSample("stress", event.target.value as StressLevel)} value={sample.stress}>
                <option value="low">{t("options.stress.low")}</option>
                <option value="moderate">{t("options.stress.moderate")}</option>
                <option value="high">{t("options.stress.high")}</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSample} type="button">
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> {t("actions.calculate")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultSection.title")}</h2>
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.referenceOnly")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBiologicalAge ?? t("metrics.emptyYears")}</strong>
              <span>{t("metrics.biologicalAge")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.differenceLabel ?? t("metrics.emptyDifference")}</strong>
              <span>{t("metrics.ageDifference")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.delta.toFixed(1) ?? t("metrics.emptyDelta")}</strong>
              <span>{t("metrics.lifestyleDelta")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.status ?? t("metrics.emptyStatus")}</strong>
              <span>{t("metrics.status")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.tips ?? []).map((tip) => (
              <div className="profile-row" key={tip}>
                <span className="badge">{t("badges.tip")}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Clock3 size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {lifestyleNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> {t("caveat.title")}
          </strong>
          <p>{t("caveat.body")}</p>
        </div>
      </aside>
    </div>
  );
}
