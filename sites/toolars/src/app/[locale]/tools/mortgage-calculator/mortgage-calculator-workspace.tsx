"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateMortgagePayment,
  defaultMortgageScenario,
  type MortgageInput,
  type MortgageResult
} from "@/lib/tools/mortgage-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "free", tone: "" },
  { key: "export", tone: "" }
] as const;

const affordabilityNotes = ["escrow", "rates", "saved"] as const;

export function MortgageCalculatorWorkspace() {
  const t = useTranslations("tools.mortgage-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/mortgage-calculator/about", localeCode);
  const [scenario, setScenario] = useState(defaultMortgageScenario as MortgageInput);
  const [result, setResult] = useState(null as MortgageResult | null);

  const calculate = () => {
    setResult(calculateMortgagePayment(scenario));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const saveScenario = () => {
    window.localStorage.setItem("toolars.mortgage-calculator.scenario", JSON.stringify(scenario));
    flashSaved();
  };

  const updateNumber = (key: keyof MortgageInput, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="mortgage-calculator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={`badge ${row.tone}`}>{t(`trustRows.${row.key}.label`)}</span>
              <span>{t(`trustRows.${row.key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={detailsHref}>{t("detailsLink")}</a>
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
            <label className="field-label" htmlFor="mortgage-home-price">
              {t("fields.homePrice")}
              <input
                className="input"
                id="mortgage-home-price"
                min={0}
                onChange={(event) => updateNumber("homePrice", event.target.value)}
                type="number"
                value={scenario.homePrice}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-down-payment">
              {t("fields.downPayment")}
              <input
                className="input"
                id="mortgage-down-payment"
                min={0}
                onChange={(event) => updateNumber("downPayment", event.target.value)}
                type="number"
                value={scenario.downPayment}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-interest-rate">
              {t("fields.interestRate")}
              <input
                className="input"
                id="mortgage-interest-rate"
                min={0}
                onChange={(event) => updateNumber("annualInterestRate", event.target.value)}
                step="0.125"
                type="number"
                value={scenario.annualInterestRate}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-loan-term">
              {t("fields.loanTerm")}
              <input
                className="input"
                id="mortgage-loan-term"
                min={1}
                onChange={(event) => updateNumber("loanTermYears", event.target.value)}
                type="number"
                value={scenario.loanTermYears}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-property-tax">
              {t("fields.propertyTax")}
              <input
                className="input"
                id="mortgage-property-tax"
                min={0}
                onChange={(event) => updateNumber("propertyTaxAnnual", event.target.value)}
                type="number"
                value={scenario.propertyTaxAnnual}
              />
            </label>
            <label className="field-label" htmlFor="mortgage-insurance">
              {t("fields.insurance")}
              <input
                className="input"
                id="mortgage-insurance"
                min={0}
                onChange={(event) => updateNumber("insuranceMonthly", event.target.value)}
                type="number"
                value={scenario.insuranceMonthly}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveScenario}>
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
            <button className="button button-solid" type="button" onClick={calculate}>
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
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>{t("metrics.totalMonthlyPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>{t("metrics.totalInterest")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.downPaymentPercent}%` : "0%"}</strong>
              <span>{t("metrics.downPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.loanToValuePercent}%` : "0%"}</strong>
              <span>{t("metrics.loanToValue")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.escrowDetail", { principalAndInterest: result.formattedPrincipalAndInterest, escrow: result.formattedMonthlyEscrow })
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
          {affordabilityNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong><ShieldCheck size={16} aria-hidden="true" /> {t("caveat.title")}</strong>
          <p>{t("caveat.body")}</p>
        </div>
      </aside>
    </div>
  );
}
