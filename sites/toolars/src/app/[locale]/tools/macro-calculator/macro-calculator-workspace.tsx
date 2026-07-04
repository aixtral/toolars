"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateMacros, defaultMacroScenario, macroPresets, type MacroGoal, type MacroInput, type MacroResult } from "@/lib/tools/macro-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const macroNotes = [
  "calories",
  "proteinMinimum",
  "adjustments"
] as const;

export function MacroCalculatorWorkspace() {
  const t = useTranslations("tools.macro-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [split, setSplit] = useState(defaultMacroScenario);
  const [result, setResult] = useState(null as MacroResult | null);

  const calculate = () => {
    setResult(calculateMacros(split));
  };

  const saveSplit = () => {
    window.localStorage.setItem("toolars.macro-calculator.split", JSON.stringify(split));
  };

  const updateNumber = (key: keyof Pick<MacroInput, "calories" | "weightKg">, value: string) => {
    setSplit((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateGoal = (value: MacroGoal) => {
    setSplit((current) => ({ ...current, goal: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="macro-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/macro-calculator/about")}>
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
            <label className="field-label" htmlFor="macro-calories">
              {t("fields.calories")}
              <input className="input" id="macro-calories" min={0} onChange={(event) => updateNumber("calories", event.target.value)} type="number" value={split.calories} />
            </label>
            <label className="field-label" htmlFor="macro-weight">
              {t("fields.weight")}
              <input className="input" id="macro-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={split.weightKg} />
            </label>
            <label className="field-label" htmlFor="macro-goal">
              {t("fields.goal")}
              <select className="input" id="macro-goal" onChange={(event) => updateGoal(event.target.value as MacroGoal)} value={split.goal}>
                {macroPresets.map((preset) => (
                  <option key={preset.goal} value={preset.goal}>
                    {t("presetOption", {
                      carbs: preset.carbsPercent,
                      fat: preset.fatPercent,
                      label: t(`goalOptions.${preset.goal}`),
                      protein: preset.proteinPercent
                    })}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSplit} type="button">
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
                      calories: formatInteger(Math.max(0, split.calories), localeCode),
                      goal: t(`goalOptions.${split.goal}`)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result ? t(`goalOptions.${split.goal}`) : t("badges.preset")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>{t("metrics.protein")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCarbs ?? "0 g"}</strong>
              <span>{t("metrics.carbs")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFat ?? "0 g"}</strong>
              <span>{t("metrics.fat")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>
                {result
                  ? t("resultSection.percentSummary", {
                      carbs: result.carbsPercent,
                      fat: result.fatPercent,
                      protein: result.proteinPercent
                    })
                  : t("callout.waitingTitle")}
              </strong>
              <small>{result ? t("recommendation.result") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {macroNotes.map((item, index) => (
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

function formatInteger(value: number, locale: LocaleCode): string {
  return Math.round(value).toLocaleString(locale);
}
