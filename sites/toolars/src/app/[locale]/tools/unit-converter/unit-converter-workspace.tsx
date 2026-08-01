"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateUnitConversion,
  defaultUnitConversionScenario,
  getUnitOptions,
  unitCategoryOptions,
  type UnitCategory,
  type UnitConversionInput,
  type UnitConversionResult
} from "@/lib/tools/unit-converter";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "precision", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const precisionNotes = [
  "sharedBase",
  "temperatureOffsets",
  "certifiedUse"
] as const;

const temperatureFormulaKeys: Record<string, string> = {
  "c:f": "cToF",
  "f:c": "fToC",
  "c:k": "cToK",
  "k:c": "kToC"
};

const defaultUnitByCategory: Record<UnitCategory, { fromUnit: string; toUnit: string }> = {
  length: { fromUnit: "km", toUnit: "mi" },
  weight: { fromUnit: "kg", toUnit: "lb" },
  temperature: { fromUnit: "c", toUnit: "f" },
  area: { fromUnit: "m2", toUnit: "ft2" },
  volume: { fromUnit: "l", toUnit: "gal_us" },
  speed: { fromUnit: "kph", toUnit: "mph" },
  data: { fromUnit: "mb", toUnit: "gb" }
};

export function UnitConverterWorkspace() {
  const t = useTranslations("tools.unit-converter.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): UnitConversionInput => defaultUnitConversionScenario);
  const [result, setResult] = useState(() => null as UnitConversionResult | null);
  const unitOptions = getUnitOptions(plan.category);
  const getCategoryLabel = (category: UnitCategory) => t(`categories.${category}`);
  const getUnitLabel = (unit: string) => t(`units.${unit}`);

  const calculate = () => {
    setResult(calculateUnitConversion(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.unit-converter.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (value: string) => {
    setPlan((current) => ({ ...current, value: Number(value) }));
    setResult(null);
  };

  const updateCategory = (value: string) => {
    const category = value as UnitCategory;
    setPlan((current) => ({
      ...current,
      category,
      fromUnit: defaultUnitByCategory[category].fromUnit,
      toUnit: defaultUnitByCategory[category].toUnit
    }));
    setResult(null);
  };

  const updateUnit = (key: "fromUnit" | "toUnit", value: string) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const getQuickReferenceUnitLabel = (unitLabel: string) => {
    const option = unitOptions.find((candidate) => candidate.label === unitLabel);
    return option ? getUnitLabel(option.value) : unitLabel;
  };

  const getFormulaNote = (conversion: UnitConversionResult) => {
    if (conversion.category !== "temperature") return conversion.formulaNote;
    const formulaKey = temperatureFormulaKeys[`${conversion.fromUnit}:${conversion.toUnit}`];
    return formulaKey ? t(`formula.temperature.${formulaKey}`) : t("formula.temperature.base");
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="unit-converter">
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
          <a className="button button-outline" href={localizedHref("/tools/unit-converter/about")}>
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
            <label className="field-label" htmlFor="unit-category">
              {t("fields.category")}
              <select className="input" id="unit-category" onChange={(event) => updateCategory(event.target.value)} value={plan.category}>
                {unitCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="unit-value">
              {t("fields.value")}
              <input className="input" id="unit-value" onChange={(event) => updateNumber(event.target.value)} type="number" value={plan.value} />
            </label>
            <label className="field-label" htmlFor="unit-from">
              {t("fields.fromUnit")}
              <select className="input" id="unit-from" onChange={(event) => updateUnit("fromUnit", event.target.value)} value={plan.fromUnit}>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {getUnitLabel(option.value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="unit-to">
              {t("fields.toUnit")}
              <select className="input" id="unit-to" onChange={(event) => updateUnit("toUnit", event.target.value)} value={plan.toUnit}>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {getUnitLabel(option.value)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
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
                      value: String(result.value),
                      fromUnit: getUnitLabel(result.fromUnit),
                      toUnit: getUnitLabel(result.toUnit)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? getCategoryLabel(result.category) : t("badges.units")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedResult ?? "0"}</strong>
              <span>{t("metrics.convertedValue")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("metrics.targetUnitValue", { unit: getUnitLabel(result.toUnit) }) : t("metrics.targetUnit")}</strong>
              <span>{t("metrics.targetUnit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? getUnitLabel(result.fromUnit) : "-"}</strong>
              <span>{t("metrics.sourceUnit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? getCategoryLabel(result.category) : "-"}</strong>
              <span>{t("metrics.category")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{result ? getFormulaNote(result) : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? result.quickReferences.map((item) => t("callout.quickReference", { unit: getQuickReferenceUnitLabel(item.unit), value: item.value })).join(" / ")
                  : t("callout.waitingDescription")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {precisionNotes.map((item, index) => (
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
