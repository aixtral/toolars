"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateInvestmentGoal,
  defaultInvestmentGoalScenario,
  type InvestmentGoalInput,
  type InvestmentGoalResult
} from "@/lib/tools/investment-goal";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "noGuarantee", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const marketNotes = [
  "formula",
  "gap",
  "variables"
] as const;

const goalStatusBadgeKeys = {
  covered: "covered",
  "needs-contribution": "needsContribution"
} as const;

export function InvestmentGoalWorkspace() {
  const t = useTranslations("tools.investment-goal.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const [plan, setPlan] = useState(defaultInvestmentGoalScenario);
  const [result, setResult] = useState<InvestmentGoalResult | null>(null);

  const calculate = () => {
    setResult(calculateInvestmentGoal(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.investment-goal.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InvestmentGoalInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="investment-goal">
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
          <a className="button button-outline" href={localizedHref("/tools/investment-goal/about")}>
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
            <label className="field-label" htmlFor="goal-amount">
              {t("fields.goalAmount")}
              <input className="input" id="goal-amount" min={0} onChange={(event) => updateNumber("goalAmount", event.target.value)} step="1" type="number" value={plan.goalAmount} />
            </label>
            <label className="field-label" htmlFor="goal-start">
              {t("fields.startingBalance")}
              <input className="input" id="goal-start" min={0} onChange={(event) => updateNumber("startingBalance", event.target.value)} step="1" type="number" value={plan.startingBalance} />
            </label>
            <label className="field-label" htmlFor="goal-return">
              {t("fields.annualReturn")}
              <input className="input" id="goal-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="goal-years">
              {t("fields.years")}
              <input className="input" id="goal-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
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
                  ? result.goalStatus === "covered"
                    ? t("resultSection.summaryCovered", {
                        goalAmount: result.formattedGoalAmount,
                        years: plan.years
                      })
                    : t("resultSection.summaryNeedsContribution", {
                        goalAmount: result.formattedGoalAmount,
                        monthlyInvestment: result.formattedMonthlyInvestment,
                        years: plan.years
                      })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? t(`badges.${goalStatusBadgeKeys[result.goalStatus]}`) : t("badges.goal")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyInvestment ?? "$0"}</strong>
              <span>{t("metrics.monthlyInvestment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInvested ?? "$0"}</strong>
              <span>{t("metrics.totalInvested")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedStartingBalanceGrowth ?? "$0"}</strong>
              <span>{t("metrics.startingBalanceGrowth")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGoalGap ?? "$0"}</strong>
              <span>{t("metrics.goalGap")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedGoalAmount ?? t("resultSection.waitingTitle")}</strong>
              <small>
                {result
                  ? t("resultSection.startingBalanceDetail", {
                      startingBalance: result.formattedStartingBalance,
                      years: plan.years
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
          {marketNotes.map((item, index) => (
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
