"use client";
import { useLocale, useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateStepsToCalories,
  defaultStepsToCaloriesScenario,
  walkingSpeedOptions,
  type StepsToCaloriesInput,
  type StepsToCaloriesResult,
  type WalkingSpeed
} from "@/lib/tools/steps-to-calories";

const storageKey = "toolars.steps-to-calories.activity:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "activity", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const activityNotes = ["stride", "met", "normalization"] as const;

export function StepsToCaloriesWorkspace() {
  const t = useTranslations("tools.steps-to-calories.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [activity, setActivity] = useState((): StepsToCaloriesInput => ({ ...defaultStepsToCaloriesScenario }));
  const [result, setResult] = useState(null as StepsToCaloriesResult | null);

  const calculate = () => {
    setResult(calculateStepsToCalories(activity));
  };

  const saveActivity = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(activity));
    } catch {}
  };

  const updateActivity = <Key extends keyof StepsToCaloriesInput>(key: Key, value: StepsToCaloriesInput[Key]) => {
    setActivity((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="steps-to-calories">
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
          <a className="button button-outline" href={localizedHref("/tools/steps-to-calories/about")}>
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
            <label className="field-label" htmlFor="steps-calories-steps">
              {t("fields.steps")}
              <input className="input" id="steps-calories-steps" min={0} onChange={(event) => updateActivity("steps", Number(event.target.value))} type="number" value={activity.steps} />
            </label>
            <label className="field-label" htmlFor="steps-calories-weight">
              {t("fields.weightKg")}
              <input className="input" id="steps-calories-weight" min={0} onChange={(event) => updateActivity("weightKg", Number(event.target.value))} type="number" value={activity.weightKg} />
            </label>
            <label className="field-label" htmlFor="steps-calories-height">
              {t("fields.heightCm")}
              <input className="input" id="steps-calories-height" min={0} onChange={(event) => updateActivity("heightCm", Number(event.target.value))} type="number" value={activity.heightCm} />
            </label>
            <label className="field-label" htmlFor="steps-calories-speed">
              {t("fields.speed")}
              <select className="input" id="steps-calories-speed" onChange={(event) => updateActivity("speed", event.target.value as WalkingSpeed)} value={activity.speed}>
                {walkingSpeedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.speed.${option.value}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveActivity} type="button">
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
            <span className="badge warn">{t("badges.met")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCalories ?? t("metrics.emptyCalories")}</strong>
              <span>{t("metrics.caloriesBurned")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDistance ?? t("metrics.emptyDistance")}</strong>
              <span>{t("metrics.distance")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRiceEquivalent ?? t("metrics.emptyRiceEquivalent")}</strong>
              <span>{t("metrics.equivalent")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedStepsPerRice ?? t("metrics.emptyStepsPerRice")}</strong>
              <span>{t("metrics.stepsPerRice")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {result ? (
              <>
                <div className="profile-row">
                  <span className="badge">{t("equivalents.soda")}</span>
                  <span>{result.formattedSodaEquivalent}</span>
                </div>
                <div className="profile-row">
                  <span className="badge">{t("equivalents.burger")}</span>
                  <span>{result.formattedBurgerEquivalent}</span>
                </div>
                <div className="profile-row">
                  <span className="badge">{t("equivalents.tenThousandSteps")}</span>
                  <span>{result.formattedTenThousandStepBurn}</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription", { met: result.met, strideMeters: result.strideMeters.toFixed(2) }) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {activityNotes.map((item, index) => (
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
