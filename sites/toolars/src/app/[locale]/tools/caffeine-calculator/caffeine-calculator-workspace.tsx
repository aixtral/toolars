"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  caffeineDrinks,
  calculateCaffeineLimit,
  defaultCaffeineScenario,
  type CaffeineDrinkId,
  type CaffeineResult
} from "@/lib/tools/caffeine-calculator";

const storageKey = "toolars.caffeine-calculator.plan:v1";
const initialResult: CaffeineResult | null = null;

const trustRows = [
  { key: "local", tone: "local" },
  { key: "timing", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const caffeineNotes = [
  "adultCap",
  "pregnancy",
  "tolerance"
] as const;

function localizedWorkspaceHref(href: string, localeCode: LocaleCode) {
  return localizePath(href, localeCode);
}

export function CaffeineCalculatorWorkspace() {
  const t = useTranslations("tools.caffeine-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [values, setValues] = useState(defaultCaffeineScenario);
  const [result, setResult] = useState(initialResult);

  const calculate = () => {
    setResult(calculateCaffeineLimit(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateWeight = (value: string) => {
    setValues((current) => ({ ...current, weightKg: Number(value) }));
    setResult(null);
  };

  const updatePregnancy = (value: string) => {
    setValues((current) => ({ ...current, pregnant: value === "yes" }));
    setResult(null);
  };

  const toggleDrink = (drinkId: CaffeineDrinkId) => {
    setValues((current) => {
      const selected = current.selectedDrinkIds.includes(drinkId) ? current.selectedDrinkIds.filter((id) => id !== drinkId) : [...current.selectedDrinkIds, drinkId];
      return { ...current, selectedDrinkIds: selected };
    });
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="caffeine-calculator">
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
          <a className="button button-outline" href={localizedWorkspaceHref("/tools/caffeine-calculator/about", localeCode)}>
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
            <label className="field-label" htmlFor="caffeine-weight">
              {t("fields.weight")}
              <input className="input" id="caffeine-weight" min={0} onChange={(event) => updateWeight(event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="caffeine-pregnant">
              {t("fields.pregnant")}
              <select className="input" id="caffeine-pregnant" onChange={(event) => updatePregnancy(event.target.value)} value={values.pregnant ? "yes" : "no"}>
                <option value="no">{t("pregnancyOptions.no")}</option>
                <option value="yes">{t("pregnancyOptions.yes")}</option>
              </select>
            </label>
          </div>

          <div className="workspace-section-title">
            <div>
              <h2>{t("drinksSection.title")}</h2>
              <p className="tool-description">{t("drinksSection.description")}</p>
            </div>
          </div>
          <div className="profile-list">
            {caffeineDrinks.map((drink) => (
              <label className="profile-row" htmlFor={`caffeine-drink-${drink.id}`} key={drink.id}>
                <input checked={values.selectedDrinkIds.includes(drink.id)} id={`caffeine-drink-${drink.id}`} onChange={() => toggleDrink(drink.id)} type="checkbox" />
                <span>{t(`drinkLabels.${drink.id}`)}</span>
                <strong>{drink.mg} mg</strong>
              </label>
            ))}
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
                      consumed: result.formattedConsumed,
                      count: result.selectedDrinks.length
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result ? t(`statuses.${getStatusKey(result)}`) : t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedDailyLimit ?? "0 mg"}</strong>
              <span>{t("metrics.dailyLimit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedConsumed ?? "0 mg"}</strong>
              <span>{t("metrics.consumed")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRemaining ?? "0 mg"}</strong>
              <span>{t("metrics.remaining")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`limitModes.${values.pregnant ? "pregnancy" : "adult"}`) : t("resultSection.pending")}</strong>
              <span>{t("metrics.limitMode")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`statuses.${getStatusKey(result)}`) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.halfLifeDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {caffeineNotes.map((item, index) => (
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

function getStatusKey(result: CaffeineResult) {
  return result.consumedMg > result.dailyLimitMg ? "aboveSafeLimit" : "withinSafeRange";
}
