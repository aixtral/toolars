"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateCalorieDeficit, defaultCalorieDeficitScenario, weeklyLossOptions, type CalorieDeficitInput, type CalorieDeficitResult } from "@/lib/tools/calorie-deficit";

const initialResult: CalorieDeficitResult | null = null;

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const deficitNotes = [
  "sustainable",
  "lowIntake",
  "habits"
] as const;

const weeklyLossOptionKeys = [
  "conservative",
  "recommended",
  "aggressive",
  "fast"
] as const;

function localizedWorkspaceHref(href: string, localeCode: LocaleCode) {
  return localizePath(href, localeCode);
}

export function CalorieDeficitWorkspace() {
  const t = useTranslations("tools.calorie-deficit.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [plan, setPlan] = useState<CalorieDeficitInput>(defaultCalorieDeficitScenario);
  const [result, setResult] = useState(initialResult);
  const numberFormatter = new Intl.NumberFormat(localeCode);
  const summaryWeightFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 1
  });
  const decimalFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
  const weeklyLossFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 2
  });

  const calculate = () => {
    setResult(calculateCalorieDeficit(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.calorie-deficit.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CalorieDeficitInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const formatCalories = (value: number) => t("formats.calories", { value: numberFormatter.format(Math.round(value)) });
  const formatWeight = (value: number) => t("formats.weightKg", { value: decimalFormatter.format(value) });
  const formatSummaryWeight = (value: number) => t("formats.weightKg", { value: summaryWeightFormatter.format(value) });
  const formatWeeklyLoss = (value: number) => t("formats.weightPerWeek", { value: weeklyLossFormatter.format(value) });
  const formatWeeks = (weeks: number) => t("formats.weeks", { count: weeks });

  return (
    <div className="llm-cost-layout" data-tool-workspace="calorie-deficit">
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
          <a className="button button-outline" href={localizedWorkspaceHref("/tools/calorie-deficit/about", localeCode)}>
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
            <label className="field-label" htmlFor="deficit-current-weight">
              {t("fields.currentWeight")}
              <input className="input" id="deficit-current-weight" min={0} onChange={(event) => updateNumber("currentWeightKg", event.target.value)} type="number" value={plan.currentWeightKg} />
            </label>
            <label className="field-label" htmlFor="deficit-target-weight">
              {t("fields.targetWeight")}
              <input className="input" id="deficit-target-weight" min={0} onChange={(event) => updateNumber("targetWeightKg", event.target.value)} type="number" value={plan.targetWeightKg} />
            </label>
            <label className="field-label" htmlFor="deficit-tdee">
              {t("fields.tdee")}
              <input className="input" id="deficit-tdee" min={0} onChange={(event) => updateNumber("tdeeCalories", event.target.value)} type="number" value={plan.tdeeCalories} />
            </label>
            <label className="field-label" htmlFor="deficit-weekly-loss">
              {t("fields.weeklyLoss")}
              <select className="input" id="deficit-weekly-loss" onChange={(event) => updateNumber("weeklyLossKg", event.target.value)} value={plan.weeklyLossKg}>
                {weeklyLossOptions.map((option, index) => (
                  <option key={option.value} value={option.value}>
                    {t(`weeklyLossOptions.${weeklyLossOptionKeys[index]}`)}
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
                      currentWeight: formatSummaryWeight(plan.currentWeightKg),
                      targetWeight: formatSummaryWeight(plan.targetWeightKg),
                      weeklyLoss: formatWeeklyLoss(plan.weeklyLossKg)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.safetyTone === "warn" ? "warn" : "local"}`}>{t(result?.safetyTone === "warn" ? "badges.caution" : "badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatCalories(result.dailyIntakeCalories) : formatCalories(0)}</strong>
              <span>{t("metrics.dailyIntake")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatCalories(result.dailyDeficitCalories) : formatCalories(0)}</strong>
              <span>{t("metrics.dailyDeficit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatWeeks(result.estimatedWeeks) : formatWeeks(0)}</strong>
              <span>{t("metrics.estimatedTime")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatWeight(result.fatToLoseKg) : formatWeight(0)}</strong>
              <span>{t("metrics.fatToLose")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`safety.${result.safetyTone}`) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.trendDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {deficitNotes.map((item, index) => (
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
