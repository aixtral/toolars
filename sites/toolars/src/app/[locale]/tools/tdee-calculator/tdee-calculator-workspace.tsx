"use client";
import { useLocale, useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  activityLevels,
  calculateTdee,
  defaultTdeeScenario,
  type TdeeInput,
  type TdeeResult
} from "@/lib/tools/tdee-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "privacy", tone: "" }
] as const;

const nutritionNotes = [
  "estimate",
  "trend",
  "medical"
] as const;

const activityLevelMessageKeys = [
  "sedentary",
  "light",
  "moderate",
  "very",
  "extra"
] as const;

export function TdeeCalculatorWorkspace() {
  const t = useTranslations("tools.tdee-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [profile, setProfile] = useState((): TdeeInput => defaultTdeeScenario);
  const [result, setResult] = useState((): TdeeResult | null => null);

  const calculate = () => {
    setResult(calculateTdee(profile));
  };

  const saveProfile = () => {
    window.localStorage.setItem("toolars.tdee-calculator.profile", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof TdeeInput, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const formattedBmr = Math.round(profile.bmr).toLocaleString("en-US");
  const formattedActivityMultiplier = Number.isInteger(profile.activityMultiplier) ? profile.activityMultiplier.toFixed(0) : String(profile.activityMultiplier);

  return (
    <div className="llm-cost-layout" data-tool-workspace="tdee-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/tdee-calculator/about")}>
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
            <label className="field-label" htmlFor="tdee-bmr">
              {t("fields.bmr")}
              <input className="input" id="tdee-bmr" min={0} onChange={(event) => updateNumber("bmr", event.target.value)} type="number" value={profile.bmr} />
            </label>
            <label className="field-label" htmlFor="tdee-activity">
              {t("fields.activity")}
              <select className="input" id="tdee-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={profile.activityMultiplier}>
                {activityLevels.map((level, index) => (
                  <option key={level.value} value={level.value}>
                    {t(`activityLevels.${activityLevelMessageKeys[index]}`)} ({level.value})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
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
                {result
                  ? t("resultSection.summary", {
                      bmr: formattedBmr,
                      activity: formattedActivityMultiplier
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTdee ?? "0"}</strong>
              <span>{t("metrics.tdee")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedActivityBurn ?? "0 kcal"}</strong>
              <span>{t("metrics.activityBurn")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatLossTarget ?? "0"}</strong>
              <span>{t("metrics.fatLossTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMuscleGainTarget ?? "0"}</strong>
              <span>{t("metrics.muscleGainTarget")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.result") : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.baselineDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {nutritionNotes.map((item, index) => (
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
