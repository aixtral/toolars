"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateHomeAffordability,
  defaultHomeAffordabilityScenario,
  type HomeAffordabilityInput,
  type HomeAffordabilityResult
} from "@/lib/tools/home-affordability-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "scenario", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const readinessNotes = ["formula", "rule", "costs"] as const;
const downPaymentOptions = [
  { value: 0.15, key: "percent15" },
  { value: 0.2, key: "percent20" },
  { value: 0.3, key: "percent30Recommended" },
  { value: 0.4, key: "percent40" },
  { value: 0.5, key: "percent50" }
] as const;
const termOptions = [
  { value: 20, key: "years20" },
  { value: 25, key: "years25" },
  { value: 30, key: "years30" }
] as const;
const dtiOptions = [
  { value: 0.28, key: "conservative28" },
  { value: 0.35, key: "moderate35" },
  { value: 0.4, key: "flexible40" }
];

export function HomeAffordabilityCalculatorWorkspace() {
  const t = useTranslations("tools.home-affordability-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/home-affordability-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultHomeAffordabilityScenario);
  const [result, setResult] = useState(null as HomeAffordabilityResult | null);

  const calculate = () => {
    setResult(calculateHomeAffordability(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.home-affordability-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof HomeAffordabilityInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="home-affordability-calculator">
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
            <label className="field-label" htmlFor="home-affordability-income">
              {t("fields.monthlyHouseholdIncome")}
              <input className="input" id="home-affordability-income" min={0} onChange={(event) => updateNumber("monthlyHouseholdIncome", event.target.value)} step="100" type="number" value={plan.monthlyHouseholdIncome} />
            </label>
            <label className="field-label" htmlFor="home-affordability-debt">
              {t("fields.existingMonthlyDebt")}
              <input className="input" id="home-affordability-debt" min={0} onChange={(event) => updateNumber("existingMonthlyDebt", event.target.value)} step="100" type="number" value={plan.existingMonthlyDebt} />
            </label>
            <label className="field-label" htmlFor="home-affordability-down">
              {t("fields.downPaymentRatio")}
              <select className="input" id="home-affordability-down" onChange={(event) => updateNumber("downPaymentRatio", event.target.value)} value={plan.downPaymentRatio}>
                {downPaymentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.downPaymentRatio.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="home-affordability-rate">
              {t("fields.annualInterestRate")}
              <input className="input" id="home-affordability-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.05" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="home-affordability-term">
              {t("fields.loanTermYears")}
              <select className="input" id="home-affordability-term" onChange={(event) => updateNumber("loanTermYears", event.target.value)} value={plan.loanTermYears}>
                {termOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.loanTermYears.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="home-affordability-dti">
              {t("fields.dtiLimit")}
              <select className="input" id="home-affordability-dti" onChange={(event) => updateNumber("dtiLimit", event.target.value)} value={plan.dtiLimit}>
                {dtiOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.dtiLimit.${option.key}`)}
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
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className={`badge ${result?.statusTone === "healthy" ? "local" : "warn"}`}>{result?.statusTone ?? t("badges.housing")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMaxPrice ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.maxAffordablePrice")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.monthlyPaymentCeiling")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoanAmount ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.loanAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDtiRatio ?? t("metrics.emptyDti")}</strong>
              <span>{t("metrics.totalDtiRatio")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.statusTitle ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", { downPayment: result.formattedDownPayment, guidance: result.guidance })
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
          {readinessNotes.map((item, index) => (
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
