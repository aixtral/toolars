"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCompoundInterest,
  defaultCompoundInterestScenario,
  type CompoundInterestInput,
  type CompoundInterestResult
} from "@/lib/tools/compound-interest";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "risk", tone: "warn" },
  { key: "export", tone: "" }
] as const;

const investmentNotes = [
  "compounding",
  "returns",
  "advice"
] as const;

export function CompoundInterestWorkspace() {
  const t = useTranslations("tools.compound-interest.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultCompoundInterestScenario);
  const [result, setResult] = useState(null as CompoundInterestResult | null);

  const calculate = () => {
    setResult(calculateCompoundInterest(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.compound-interest.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (key: keyof CompoundInterestInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="compound-interest">
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
          <a className="button button-outline" href={localizedHref("/tools/compound-interest/about")}>
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
            <label className="field-label" htmlFor="compound-initial">
              {t("fields.initialInvestment")}
              <input className="input" id="compound-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="compound-contribution">
              {t("fields.monthlyContribution")}
              <input className="input" id="compound-contribution" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="compound-return">
              {t("fields.annualReturn")}
              <input className="input" id="compound-return" min={0} onChange={(event) => updateNumber("annualReturnRate", event.target.value)} step="0.1" type="number" value={plan.annualReturnRate} />
            </label>
            <label className="field-label" htmlFor="compound-years">
              {t("fields.years")}
              <input className="input" id="compound-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} type="number" value={plan.years} />
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
                      initial: formatCurrency(plan.initialInvestment),
                      monthly: formatCurrency(plan.monthlyContribution),
                      years: plan.years
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFutureValue ?? "$0"}</strong>
              <span>{t("metrics.futureValue")}</span>
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
              <strong>{result ? String(result.yearlyRows.length) : "0"}</strong>
              <span>{t("metrics.yearRows")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("resultSection.projectionTitle") : t("resultSection.waitingTitle")}</strong>
              <small>
                {result
                  ? t("resultSection.firstYearDetail", {
                      balance: result.firstYear.formattedBalance,
                      interest: result.firstYear.formattedInterestEarned
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
          {investmentNotes.map((item, index) => (
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
