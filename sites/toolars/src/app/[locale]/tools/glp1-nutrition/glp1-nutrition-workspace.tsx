"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Heart } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateGlp1Nutrition,
  defaultGlp1NutritionScenario,
  type Glp1Medication,
  type Glp1NutritionInput,
  type Glp1NutritionSex
} from "@/lib/tools/glp1-nutrition";

const storageKey = "toolars.glp1-nutrition.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "medical", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const medicationNotes = ["model", "protein", "supervision"] as const;
const sexOptions = ["male", "female"] as const;
const medicationOptions = ["semaglutide", "tirzepatide", "liraglutide", "dulaglutide", "other"] as const;
const activityOptions = [
  { value: 1.2, key: "sedentary" },
  { value: 1.375, key: "light" },
  { value: 1.55, key: "moderate" },
  { value: 1.725, key: "veryActive" }
] as const;

export function Glp1NutritionWorkspace() {
  const t = useTranslations("tools.glp1-nutrition.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/glp1-nutrition/about", localeCode);
  const [values, setValues] = useState(defaultGlp1NutritionScenario);
  const [result, setResult] = useState<ReturnType<typeof calculateGlp1Nutrition> | null>(null);
  const activityKey = activityOptions.find((option) => option.value === Number(values.activityFactor))?.key ?? "light";

  const calculate = () => {
    setResult(calculateGlp1Nutrition(values));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<Glp1NutritionInput, "weightKg" | "heightCm" | "age" | "activityFactor">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="glp1-nutrition">
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
            <label className="field-label" htmlFor="glp1-nutrition-weight">
              {t("fields.weightKg")}
              <input className="input" id="glp1-nutrition-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-height">
              {t("fields.heightCm")}
              <input className="input" id="glp1-nutrition-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} step="0.1" type="number" value={values.heightCm} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-age">
              {t("fields.age")}
              <input className="input" id="glp1-nutrition-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={values.age} />
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-sex">
              {t("fields.sex")}
              <select className="input" id="glp1-nutrition-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as Glp1NutritionSex }))} value={values.sex}>
                {sexOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.sex.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-medication">
              {t("fields.medication")}
              <select className="input" id="glp1-nutrition-medication" onChange={(event) => setValues((current) => ({ ...current, medication: event.target.value as Glp1Medication }))} value={values.medication}>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.medication.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="glp1-nutrition-activity">
              {t("fields.activityFactor")}
              <select className="input" id="glp1-nutrition-activity" onChange={(event) => updateNumber("activityFactor", event.target.value)} value={values.activityFactor}>
                {activityOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.activityFactor.${option.key}`)}
                  </option>
                ))}
              </select>
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
                {result
                  ? t("resultSection.calculatedDescription", { calorieFloor: result.formattedCalorieFloor, protein: result.proteinGrams })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.medical")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCalorieFloor ?? t("metrics.emptyKcal")}</strong>
              <span>{t("metrics.calorieFloor")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? t("metrics.emptyGrams")}</strong>
              <span>{t("metrics.protein")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWater ?? t("metrics.emptyWater")}</strong>
              <span>{t("metrics.hydration")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFiber ?? t("metrics.emptyGrams")}</strong>
              <span>{t("metrics.fiber")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            <div className="profile-row">
              <span>{t("metrics.bmr")}</span>
              <strong>{result?.formattedBmr ?? t("metrics.emptyKcal")}</strong>
            </div>
            <div className="profile-row">
              <span>{t("metrics.medication")}</span>
              <strong>{t(`options.medication.${values.medication}`)}</strong>
            </div>
            <div className="profile-row">
              <span>{t("metrics.activity")}</span>
              <strong>{t(`options.activityFactor.${activityKey}`)}</strong>
            </div>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.calculatedTitle") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {medicationNotes.map((item, index) => (
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
