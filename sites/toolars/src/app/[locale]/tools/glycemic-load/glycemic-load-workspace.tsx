"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Droplet, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateGlycemicLoad,
  defaultGlycemicLoadScenario,
  getGlycemicFood,
  glycemicFoods,
  type GlycemicFoodId,
  type GlycemicLoadInput,
  type GlycemicLoadResult
} from "@/lib/tools/glycemic-load";

const storageKey = "toolars.glycemic-load.sample:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "diet", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const glycemicNotes = [
  "formula",
  "bands",
  "context"
] as const;

type GlycemicCategoryKey = "low" | "medium" | "high";

export function GlycemicLoadWorkspace() {
  const t = useTranslations("tools.glycemic-load.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(defaultGlycemicLoadScenario);
  const [result, setResult] = useState(null as GlycemicLoadResult | null);
  const decimalFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
  const integerFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });
  const categoryKey = result ? getGlycemicCategoryKey(result.glycemicLoad) : null;

  const calculate = () => {
    setResult(calculateGlycemicLoad(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateFood = (foodId: GlycemicFoodId) => {
    const food = getGlycemicFood(foodId);
    setValues({
      foodId,
      servingGrams: food.defaultServingGrams,
      glycemicIndex: food.glycemicIndex,
      carbsPer100g: food.carbsPer100g
    });
    setResult(null);
  };

  const updateNumber = (key: keyof Pick<GlycemicLoadInput, "servingGrams" | "glycemicIndex" | "carbsPer100g">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const formatDecimal = (value: number) => decimalFormatter.format(value);
  const formatGrams = (value: number) => t("formats.grams", { value: formatDecimal(value) });

  return (
    <div className="llm-cost-layout" data-tool-workspace="glycemic-load">
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
          <a className="button button-outline" href={localizedHref("/tools/glycemic-load/about")}>
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
            <label className="field-label" htmlFor="glycemic-food">
              {t("fields.food")}
              <select className="input" id="glycemic-food" onChange={(event) => updateFood(event.target.value as GlycemicFoodId)} value={values.foodId}>
                {glycemicFoods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {t(`foodOptions.${food.id}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="glycemic-serving">
              {t("fields.serving")}
              <input className="input" id="glycemic-serving" min={0} onChange={(event) => updateNumber("servingGrams", event.target.value)} step="1" type="number" value={values.servingGrams} />
            </label>
            <label className="field-label" htmlFor="glycemic-gi">
              {t("fields.glycemicIndex")}
              <input className="input" id="glycemic-gi" min={0} onChange={(event) => updateNumber("glycemicIndex", event.target.value)} step="1" type="number" value={values.glycemicIndex} />
            </label>
            <label className="field-label" htmlFor="glycemic-carbs">
              {t("fields.carbs")}
              <input className="input" id="glycemic-carbs" min={0} onChange={(event) => updateNumber("carbsPer100g", event.target.value)} step="0.1" type="number" value={values.carbsPer100g} />
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
                      gl: formatDecimal(result.glycemicLoad),
                      carbs: formatGrams(result.totalCarbs)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{categoryKey ? t(`categories.${categoryKey}.label`) : t("badges.glBands")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatDecimal(result.glycemicLoad) : formatDecimal(0)}</strong>
              <span>{t("metrics.glycemicLoad")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatGrams(result.totalCarbs) : formatGrams(0)}</strong>
              <span>{t("metrics.totalCarbs")}</span>
            </article>
            <article className="llm-metric">
              <strong>{categoryKey ? t(`categories.${categoryKey}.label`) : t("resultSection.pending")}</strong>
              <span>{t("metrics.category")}</span>
            </article>
            <article className="llm-metric">
              <strong>{integerFormatter.format(values.glycemicIndex)}</strong>
              <span>{t("metrics.glycemicIndex")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplet size={18} aria-hidden="true" />
            <span>
              <strong>{categoryKey ? t(`categories.${categoryKey}.impact`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {glycemicNotes.map((item, index) => (
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

function getGlycemicCategoryKey(glycemicLoad: number): GlycemicCategoryKey {
  if (glycemicLoad <= 10) return "low";
  if (glycemicLoad <= 19) return "medium";
  return "high";
}
