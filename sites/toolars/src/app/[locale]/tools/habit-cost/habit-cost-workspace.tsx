"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Coffee, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateHabitCost,
  defaultHabitCostScenario,
  type HabitCostInput,
  type HabitCostResult
} from "@/lib/tools/habit-cost";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reflection", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const reflectionNotes = [
  "weeklySpend",
  "futureValue",
  "nonFinancialValue"
] as const;

export function HabitCostWorkspace() {
  const t = useTranslations("tools.habit-cost.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultHabitCostScenario);
  const [result, setResult] = useState(null as HabitCostResult | null);
  const resultSummary = result
    ? t("resultSection.summary", {
        weeklyCost: result.formattedWeeklyCost,
        years: formatNumber(result.years)
      })
    : t("resultSection.emptyDescription");

  const calculate = () => {
    setResult(calculateHabitCost(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.habit-cost.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof HabitCostInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="habit-cost">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map(({ key, tone }) => (
            <div className="profile-row" key={key}>
              <span className={tone ? `badge ${tone}` : "badge"}>{t(`trustRows.${key}.label`)}</span>
              <span>{t(`trustRows.${key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/habit-cost/about")}>
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
            <label className="field-label" htmlFor="habit-cost-per">
              {t("fields.costPerOccurrence")}
              <input className="input" id="habit-cost-per" min={0} onChange={(event) => updateNumber("costPerOccurrence", event.target.value)} step="0.01" type="number" value={plan.costPerOccurrence} />
            </label>
            <label className="field-label" htmlFor="habit-frequency">
              {t("fields.frequencyPerWeek")}
              <input className="input" id="habit-frequency" min={0} onChange={(event) => updateNumber("frequencyPerWeek", event.target.value)} step="0.1" type="number" value={plan.frequencyPerWeek} />
            </label>
            <label className="field-label" htmlFor="habit-years">
              {t("fields.years")}
              <input className="input" id="habit-years" min={0} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="habit-return">
              {t("fields.annualReturnRate")}
              <input className="input" id="habit-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge local">{result ? t("badges.opportunity") : t("badges.habit")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFutureValue ?? "$0"}</strong>
              <span>{t("metrics.futureValue")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalSpent ?? "$0"}</strong>
              <span>{t("metrics.totalSpent")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInvestmentGain ?? "$0"}</strong>
              <span>{t("metrics.investmentGain")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWeeklyCost ?? "$0"}</strong>
              <span>{t("metrics.weeklyCost")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Coffee size={18} aria-hidden="true" />
            <span>
              <strong>{result ? resultSummary : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {reflectionNotes.map((item, index) => (
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}
