"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateBudgetRule,
  defaultBudgetRuleScenario,
  type BudgetRuleInput,
  type BudgetRuleResult
} from "@/lib/tools/budget-rule";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const budgetNotes = [
  "split",
  "adjust",
  "review"
] as const;

export function BudgetRuleWorkspace() {
  const t = useTranslations("tools.budget-rule.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/budget-rule/about", localeCode);
  const [plan, setPlan] = useState(defaultBudgetRuleScenario);
  const [result, setResult] = useState(null as BudgetRuleResult | null);

  const calculate = () => {
    setResult(calculateBudgetRule(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.budget-rule.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof BudgetRuleInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="budget-rule">
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
            <label className="field-label" htmlFor="budget-income">
              {t("fields.monthlyIncome")}
              <input className="input" id="budget-income" min={0} onChange={(event) => updateNumber("monthlyIncome", event.target.value)} type="number" value={plan.monthlyIncome} />
            </label>
            <label className="field-label" htmlFor="budget-needs">
              {t("fields.needsPercent")}
              <input className="input" id="budget-needs" min={0} onChange={(event) => updateNumber("needsPercent", event.target.value)} type="number" value={plan.needsPercent} />
            </label>
            <label className="field-label" htmlFor="budget-wants">
              {t("fields.wantsPercent")}
              <input className="input" id="budget-wants" min={0} onChange={(event) => updateNumber("wantsPercent", event.target.value)} type="number" value={plan.wantsPercent} />
            </label>
            <label className="field-label" htmlFor="budget-savings">
              {t("fields.savingsPercent")}
              <input className="input" id="budget-savings" min={0} onChange={(event) => updateNumber("savingsPercent", event.target.value)} type="number" value={plan.savingsPercent} />
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
                      needs: Math.max(0, plan.needsPercent),
                      wants: Math.max(0, plan.wantsPercent),
                      savings: Math.max(0, plan.savingsPercent)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.healthTone === "warning" ? "warn" : "local"}`}>
              {result ? t("badges.total", { percent: result.totalPercent }) : t("badges.budget")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedIncome ?? "$0"}</strong>
              <span>{t("metrics.monthlyIncome")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNeedsAmount ?? "$0"}</strong>
              <span>{t("metrics.needs")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWantsAmount ?? "$0"}</strong>
              <span>{t("metrics.wants")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSavingsAmount ?? "$0"}</strong>
              <span>{t("metrics.savings")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`resultSection.healthMessages.${result.healthTone}`, { total: result.totalPercent }) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.envelopeDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {budgetNotes.map((item, index) => (
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
