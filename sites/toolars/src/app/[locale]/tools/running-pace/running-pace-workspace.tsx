"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateRunningPace,
  defaultRunningPaceScenario,
  runningDistanceOptions,
  type RunningDistancePreset,
  type RunningPaceInput,
  type RunningPaceResult
} from "@/lib/tools/running-pace";

const storageKey = "toolars.running-pace.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "training", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const raceNotes = [
  "calculation",
  "riegel",
  "conditions"
] as const;

export function RunningPaceWorkspace() {
  const t = useTranslations("tools.running-pace.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(() => defaultRunningPaceScenario as RunningPaceInput);
  const [result, setResult] = useState(null as RunningPaceResult | null);
  const selectedDistanceLabel = result ? formatDistanceLabel(t, plan.distancePreset, result.distanceKm) : null;

  const calculate = () => {
    setResult(calculateRunningPace(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<RunningPaceInput, "customDistanceKm" | "hours" | "minutes" | "seconds">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updatePreset = (value: RunningDistancePreset) => {
    setPlan((current) => ({ ...current, distancePreset: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="running-pace">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map(({ key, tone }) => (
            <div className="profile-row" key={key}>
              <span className={`badge ${tone}`}>{t(`trustRows.${key}.label`)}</span>
              <span>{t(`trustRows.${key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/running-pace/about")}>
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
            <label className="field-label" htmlFor="running-distance">
              {t("fields.distance")}
              <select className="input" id="running-distance" onChange={(event) => updatePreset(event.target.value as RunningDistancePreset)} value={plan.distancePreset}>
                {runningDistanceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`distanceOptions.${option.value}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="running-custom-distance">
              {t("fields.customDistance")}
              <input className="input" id="running-custom-distance" min={0.1} onChange={(event) => updateNumber("customDistanceKm", event.target.value)} step="0.1" type="number" value={plan.customDistanceKm} />
            </label>
            <label className="field-label" htmlFor="running-hours">
              {t("fields.hours")}
              <input className="input" id="running-hours" min={0} onChange={(event) => updateNumber("hours", event.target.value)} type="number" value={plan.hours} />
            </label>
            <label className="field-label" htmlFor="running-minutes">
              {t("fields.minutes")}
              <input className="input" id="running-minutes" max={59} min={0} onChange={(event) => updateNumber("minutes", event.target.value)} type="number" value={plan.minutes} />
            </label>
            <label className="field-label" htmlFor="running-seconds">
              {t("fields.seconds")}
              <input className="input" id="running-seconds" max={59} min={0} onChange={(event) => updateNumber("seconds", event.target.value)} type="number" value={plan.seconds} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
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
              <p className="tool-description">
                {result && selectedDistanceLabel
                  ? t("resultSection.summary", { distance: selectedDistanceLabel, time: result.formattedTargetTime })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.riegel")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedPacePerKm ?? "--"}</strong>
              <span>{t("metrics.pacePerKm")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPacePerMile ?? "--"}</strong>
              <span>{t("metrics.pacePerMile")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSpeed ?? "--"}</strong>
              <span>{t("metrics.speed")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLap400m ?? "--"}</strong>
              <span>{t("metrics.lap400m")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.equivalents ?? []).map((equivalent) => (
              <div className="profile-row" key={equivalent.name}>
                <span className="badge">{t(`equivalents.${getEquivalentKey(equivalent.distanceKm)}`)}</span>
                <span>
                  <strong>{equivalent.formattedTime}</strong> {t("resultSection.equivalentPaceDetail", { pace: equivalent.formattedPace })}
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Timer size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.equivalent") : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.targetTime", { time: result.formattedTargetTime }) : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {raceNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> {t("recommendation.title")}
          </strong>
          <p>{t("recommendation.body")}</p>
        </div>
      </aside>
    </div>
  );
}

function formatDistanceLabel(t: ReturnType<typeof useTranslations>, preset: RunningDistancePreset, distanceKm: number) {
  if (preset === "custom") {
    return t("distanceOptions.customDistance", { distance: distanceKm.toFixed(1) });
  }

  return t(`distanceOptions.${preset}`);
}

function getEquivalentKey(distanceKm: number) {
  if (Math.abs(distanceKm - 21.0975) < 0.01) return "half-marathon";
  if (Math.abs(distanceKm - 42.195) < 0.01) return "marathon";
  return `${Math.round(distanceKm)}k`;
}
