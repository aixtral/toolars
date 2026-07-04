"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Dumbbell, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateProteinNeeds, defaultProteinScenario, proteinFactors, type ProteinInput, type ProteinResult } from "@/lib/tools/protein-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const nutritionNotes = [
  "ranges",
  "meals",
  "care"
] as const;

const proteinFactorKeys = [
  "sedentary",
  "lightlyActive",
  "moderateExercise",
  "strengthTraining",
  "muscleBuilding"
] as const;

export function ProteinCalculatorWorkspace() {
  const t = useTranslations("tools.protein-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/protein-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultProteinScenario);
  const [result, setResult] = useState(null as ProteinResult | null);
  const numberFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });
  const factorFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 1
  });
  const selectedFactorIndex = proteinFactors.findIndex((factor) => {
    return Math.abs(factor.value - plan.factor) < 0.001;
  });
  const selectedFactorKey = selectedFactorIndex !== -1 ? proteinFactorKeys[selectedFactorIndex] : null;
  const selectedFactorLabel = selectedFactorKey
    ? t(`proteinFactors.${selectedFactorKey}`)
    : t("formats.customFactor", { value: factorFormatter.format(plan.factor) });

  const calculate = () => {
    setResult(calculateProteinNeeds(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.protein-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof ProteinInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  function formatNumber(value: number) {
    return numberFormatter.format(Math.round(value));
  }

  function formatGrams(value: number) {
    return t("formats.grams", { value: formatNumber(value) });
  }

  function formatEggs(value: number) {
    return t("formats.eggs", { value: formatNumber(value) });
  }

  function formatFactor(value: number) {
    return factorFormatter.format(value);
  }

  return (
    <div className="llm-cost-layout" data-tool-workspace="protein-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={`badge ${row.tone}`}>{t(`trustRows.${row.key}.label`)}</span>
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
            <label className="field-label" htmlFor="protein-weight">
              {t("fields.weight")}
              <input className="input" id="protein-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="protein-factor">
              {t("fields.goal")}
              <select className="input" id="protein-factor" onChange={(event) => updateNumber("factor", event.target.value)} value={plan.factor}>
                {proteinFactors.map((factor, index) => (
                  <option key={factor.value} value={factor.value}>
                    {t("formats.factorOption", {
                      label: t(`proteinFactors.${proteinFactorKeys[index]}`),
                      value: formatFactor(factor.value)
                    })}
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
                  ? t("resultSection.summary", {
                      weight: formatNumber(plan.weightKg),
                      factor: formatFactor(plan.factor)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result ? selectedFactorLabel : t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatGrams(result.proteinGrams) : formatGrams(0)}</strong>
              <span>{t("metrics.dailyTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatGrams(result.perMealGrams) : formatGrams(0)}</strong>
              <span>{t("metrics.perMeal")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatEggs(result.eggsEquivalent) : formatEggs(0)}</strong>
              <span>{t("metrics.eggEquivalent")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatGrams(result.chickenBreastGrams) : formatGrams(0)}</strong>
              <span>{t("metrics.chickenBreast")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Dumbbell size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.recommendation") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.resultDescription") : t("callout.waitingDescription")}</small>
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
