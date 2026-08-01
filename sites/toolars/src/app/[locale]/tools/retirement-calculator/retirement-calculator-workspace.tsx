"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateRetirementPlan,
  defaultRetirementScenario,
  type RetirementInput,
  type RetirementResult
} from "@/lib/tools/retirement-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const retirementNotes = ["target", "compounding", "risks"] as const;

export function RetirementCalculatorWorkspace() {
  const t = useTranslations("tools.retirement-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/retirement-calculator/about", localeCode);
  const [plan, setPlan] = useState((): RetirementInput => ({ ...defaultRetirementScenario }));
  const [result, setResult] = useState(null as RetirementResult | null);

  const calculate = () => {
    setResult(calculateRetirementPlan(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.retirement-calculator.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (key: keyof RetirementInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="retirement-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={row.tone ? `badge ${row.tone}` : "badge"}>{t(`trustRows.${row.key}.label`)}</span>
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
            <label className="field-label" htmlFor="retirement-current-age">
              {t("fields.currentAge")}
              <input className="input" id="retirement-current-age" min={0} onChange={(event) => updateNumber("currentAge", event.target.value)} type="number" value={plan.currentAge} />
            </label>
            <label className="field-label" htmlFor="retirement-age">
              {t("fields.retirementAge")}
              <input className="input" id="retirement-age" min={0} onChange={(event) => updateNumber("retirementAge", event.target.value)} type="number" value={plan.retirementAge} />
            </label>
            <label className="field-label" htmlFor="retirement-savings">
              {t("fields.currentSavings")}
              <input className="input" id="retirement-savings" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="retirement-monthly">
              {t("fields.monthlyContribution")}
              <input className="input" id="retirement-monthly" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="retirement-return">
              {t("fields.annualReturnRate")}
              <input className="input" id="retirement-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
            <label className="field-label" htmlFor="retirement-expenses">
              {t("fields.monthlyRetirementExpenses")}
              <input className="input" id="retirement-expenses" min={0} onChange={(event) => updateNumber("monthlyRetirementExpenses", event.target.value)} type="number" value={plan.monthlyRetirementExpenses} />
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
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.rule")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNestEggNeeded ?? t("resultSection.zeroAmount")}</strong>
              <span>{t("metrics.nestEggNeeded")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProjectedSavings ?? t("resultSection.zeroAmount")}</strong>
              <span>{t("metrics.projectedSavings")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGapOrSurplus ?? t("resultSection.zeroAmount")}</strong>
              <span>{t("metrics.gapOrSurplus")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.isValidTimeline ? String(result.yearsToRetirement) : t("resultSection.zeroYears")}</strong>
              <span>{t("metrics.yearsToRetirement")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>
                {result
                  ? result.isValidTimeline
                    ? t("callout.firstYearTemplate", {
                        balance: result.firstYear.formattedBalance,
                        contributions: result.firstYear.formattedContributions
                      })
                    : result.warning
                  : t("callout.waitingTitle")}
              </strong>
              <small>{result?.isValidTimeline ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {retirementNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> {t("caveat.title")}
          </strong>
          <p>{t("caveat.body")}</p>
        </div>
      </aside>
    </div>
  );
}
