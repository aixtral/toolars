"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Download, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateLoanPayment,
  defaultLoanScenario,
  type LoanInput,
  type LoanResult
} from "@/lib/tools/loan-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "apr", tone: "warn" },
  { key: "export", tone: "" }
] as const;

const amortizationNotes = ["formula", "interest", "payoff"] as const;

function getLoanRecommendationKey(input: LoanInput): "highApr" | "longTerm" | "reviewApr" {
  if (input.annualInterestRate >= 10) return "highApr";
  if (input.termYears > 7) return "longTerm";
  return "reviewApr";
}

export function LoanCalculatorWorkspace() {
  const t = useTranslations("tools.loan-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [scenario, setScenario] = useState(defaultLoanScenario);
  const [result, setResult] = useState(null as LoanResult | null);

  const calculate = () => {
    setResult(calculateLoanPayment(scenario));
  };

  const saveScenario = () => {
    window.localStorage.setItem("toolars.loan-calculator.scenario", JSON.stringify(scenario));
  };

  const updateNumber = (key: keyof LoanInput, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const resultSummary = result
    ? t("resultSection.summary", {
        payments: result.paymentCount,
        amount: result.formattedMonthlyPayment,
        years: scenario.termYears
      })
    : t("resultSection.emptyDescription");

  return (
    <div className="llm-cost-layout" data-tool-workspace="loan-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/loan-calculator/about")}>
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
            <label className="field-label" htmlFor="loan-principal">
              {t("fields.principal")}
              <input className="input" id="loan-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} type="number" value={scenario.principal} />
            </label>
            <label className="field-label" htmlFor="loan-rate">
              {t("fields.annualInterestRate")}
              <input className="input" id="loan-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={scenario.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="loan-term">
              {t("fields.termYears")}
              <input className="input" id="loan-term" min={1} onChange={(event) => updateNumber("termYears", event.target.value)} type="number" value={scenario.termYears} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveScenario} type="button">
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
            <button disabled className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> {t("actions.exportPlan")}
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>{t("metrics.monthlyPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>{t("metrics.totalInterest")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalRepayment ?? "$0"}</strong>
              <span>{t("metrics.totalRepayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.paymentCount) : "0"}</strong>
              <span>{t("metrics.payments")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Calculator size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`recommendations.${getLoanRecommendationKey(scenario)}`) : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", {
                      principal: result.firstYear.formattedPrincipalPaid,
                      interest: result.firstYear.formattedInterestPaid
                    })
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
          {amortizationNotes.map((item, index) => (
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
