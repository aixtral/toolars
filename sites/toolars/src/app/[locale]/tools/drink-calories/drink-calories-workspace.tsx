"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateDrinkCalories,
  defaultDrinkCaloriesScenario,
  drinkCaloriesReferences,
  type DrinkCaloriesId,
  type DrinkCaloriesInput,
  type DrinkCaloriesResult
} from "@/lib/tools/drink-calories";

const storageKey = "toolars.drink-calories.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "nutrition", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const drinkNotes = [
  "references",
  "steps",
  "who"
] as const;

export function DrinkCaloriesWorkspace() {
  const t = useTranslations("tools.drink-calories.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(defaultDrinkCaloriesScenario);
  const [result, setResult] = useState(null as DrinkCaloriesResult | null);
  const effectiveServingSizeMl = getEffectiveServingSizeMl(values);
  const effectiveCups = getEffectiveCups(values);
  const cupLabel = effectiveCups === 1 ? t("units.cup") : t("units.cups");

  const calculate = () => {
    setResult(calculateDrinkCalories(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<DrinkCaloriesInput, "servingSizeMl" | "cups" | "customCaloriesPer100Ml" | "customSugarPer100Ml">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="drink-calories">
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
          <a className="button button-outline" href={localizedHref("/tools/drink-calories/about")}>
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
            <label className="field-label" htmlFor="drink-calories-type">
              {t("fields.drinkType")}
              <select className="input" id="drink-calories-type" onChange={(event) => setValues((current) => ({ ...current, drinkId: event.target.value as DrinkCaloriesId }))} value={values.drinkId}>
                {drinkCaloriesReferences.map((drink) => (
                  <option key={drink.id} value={drink.id}>
                    {t(`drinkOptions.${drink.id}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="drink-calories-size">
              {t("fields.servingSize")}
              <input className="input" id="drink-calories-size" min={0} onChange={(event) => updateNumber("servingSizeMl", event.target.value)} step="1" type="number" value={values.servingSizeMl} />
            </label>
            <label className="field-label" htmlFor="drink-calories-cups">
              {t("fields.cups")}
              <input className="input" id="drink-calories-cups" min={0} onChange={(event) => updateNumber("cups", event.target.value)} step="0.5" type="number" value={values.cups} />
            </label>
            <label className="field-label" htmlFor="drink-custom-calories">
              {t("fields.customCalories")}
              <input className="input" id="drink-custom-calories" min={0} onChange={(event) => updateNumber("customCaloriesPer100Ml", event.target.value)} step="1" type="number" value={values.customCaloriesPer100Ml} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
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
                      calories: result.formattedTotalCalories,
                      cups: formatNumber(effectiveCups),
                      cupLabel
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.sugarReference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalCalories ?? "0 kcal"}</strong>
              <span>{t("metrics.totalCalories")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSugar ?? "0 g"}</strong>
              <span>{t("metrics.sugar")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSteps ?? "--"}</strong>
              <span>{t("metrics.stepsToBurn")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDailyPercent ?? "0.0%"}</strong>
              <span>{t("metrics.dailyCalories")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`tips.${getDrinkTipKey(result)}`, { percent: ((result.totalCalories / 2000) * 100).toFixed(0) }) : t("resultSection.waitingTitle")}</strong>
              <small>
                {result
                  ? t("resultSection.perCupDescription", {
                      drink: t(`drinkOptions.${values.drinkId}`),
                      servingSize: effectiveServingSizeMl,
                      cups: formatNumber(effectiveCups)
                    })
                  : t("resultSection.waitingDescription")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {drinkNotes.map((item, index) => (
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

function getDrinkTipKey(result: DrinkCaloriesResult) {
  if (result.totalSugarGrams > 25) return "sugarHigh";
  if (result.totalCalories > 500) return "caloriesHigh";
  return "healthy";
}

function getEffectiveServingSizeMl(values: DrinkCaloriesInput) {
  const servingSizeMl = cleanNumber(values.servingSizeMl);
  return servingSizeMl || 500;
}

function getEffectiveCups(values: DrinkCaloriesInput) {
  const cups = cleanNumber(values.cups);
  return cups || 1;
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
