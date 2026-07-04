"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSavingsGoal,
  defaultSavingsGoalScenario,
  type SavingsGoalInput,
  type SavingsGoalResult
} from "@/lib/tools/savings-goal";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const savingsNotes = [
  "fixed",
  "capped",
  "nearTerm"
] as const;

export function SavingsGoalWorkspace() {
  const t = useTranslations("tools.savings-goal.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultSavingsGoalScenario as SavingsGoalInput);
  const [result, setResult] = useState(null as SavingsGoalResult | null);

  const calculate = () => {
    setResult(calculateSavingsGoal(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.savings-goal.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof SavingsGoalInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const formatTimeToGoal = (goalResult: SavingsGoalResult) => {
    if (goalResult.timeLabel === "50+ years") return t("resultSection.timeYearsPlus");
    return t("resultSection.timeMonths", { count: goalResult.monthsToGoal });
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="savings-goal">
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
          <a className="button button-outline" href={localizedHref("/tools/savings-goal/about")}>
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
            <label className="field-label" htmlFor="savings-goal-amount">
              {t("fields.goalAmount")}
              <input className="input" id="savings-goal-amount" min={0} onChange={(event) => updateNumber("goalAmount", event.target.value)} type="number" value={plan.goalAmount} />
            </label>
            <label className="field-label" htmlFor="savings-goal-saved">
              {t("fields.currentSavings")}
              <input className="input" id="savings-goal-saved" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="savings-goal-monthly">
              {t("fields.monthlySavings")}
              <input className="input" id="savings-goal-monthly" min={0} onChange={(event) => updateNumber("monthlySavings", event.target.value)} type="number" value={plan.monthlySavings} />
            </label>
            <label className="field-label" htmlFor="savings-goal-rate">
              {t("fields.annualReturn")}
              <input className="input" id="savings-goal-rate" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
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
                      goal: result.formattedGoalAmount,
                      monthly: formatCurrency(plan.monthlySavings)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.projection")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatTimeToGoal(result) : t("resultSection.emptyTime")}</strong>
              <span>{t("metrics.timeToGoal")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalContributions ?? "$0"}</strong>
              <span>{t("metrics.totalContributions")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInterestEarned ?? "$0"}</strong>
              <span>{t("metrics.interestEarned")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFinalAmount ?? "$0"}</strong>
              <span>{t("metrics.finalAmount")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("resultSection.targetTitle", { amount: result.formattedGoalAmount }) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.feasibilityDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {savingsNotes.map((item, index) => (
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

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
