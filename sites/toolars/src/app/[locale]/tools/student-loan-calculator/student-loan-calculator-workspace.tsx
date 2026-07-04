"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, GraduationCap, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateStudentLoan,
  defaultStudentLoanScenario,
  type StudentLoanInput,
  type StudentLoanResult
} from "@/lib/tools/student-loan-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "estimate", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const repaymentNotes = ["formula", "grace", "alternatives"] as const;
const termOptions = [
  { value: 5, key: "years5" },
  { value: 10, key: "years10Standard" },
  { value: 15, key: "years15" },
  { value: 20, key: "years20" },
  { value: 25, key: "years25" }
] as const;
const graceOptions = [
  { value: 0, key: "none" },
  { value: 6, key: "months6" },
  { value: 12, key: "months12" }
] as const;

export function StudentLoanCalculatorWorkspace() {
  const t = useTranslations("tools.student-loan-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/student-loan-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultStudentLoanScenario);
  const [result, setResult] = useState(null as StudentLoanResult | null);

  const calculate = () => {
    setResult(calculateStudentLoan(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.student-loan-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof StudentLoanInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="student-loan-calculator">
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
            <label className="field-label" htmlFor="student-loan-amount">
              {t("fields.loanAmount")}
              <input className="input" id="student-loan-amount" min={0} onChange={(event) => updateNumber("loanAmount", event.target.value)} step="1000" type="number" value={plan.loanAmount} />
            </label>
            <label className="field-label" htmlFor="student-loan-rate">
              {t("fields.annualInterestRate")}
              <input className="input" id="student-loan-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.01" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="student-loan-term">
              {t("fields.repaymentTermYears")}
              <select className="input" id="student-loan-term" onChange={(event) => updateNumber("repaymentTermYears", event.target.value)} value={plan.repaymentTermYears}>
                {termOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.repaymentTermYears.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="student-loan-grace">
              {t("fields.graceMonths")}
              <select className="input" id="student-loan-grace" onChange={(event) => updateNumber("graceMonths", event.target.value)} value={plan.graceMonths}>
                {graceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.graceMonths.${option.key}`)}
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
            <span className="badge warn">{t("badges.loan")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.monthlyPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.totalInterest")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalRepayment ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.totalRepayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.firstYear.formattedEndingBalance ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.yearOneEndingBalance")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <GraduationCap size={18} aria-hidden="true" />
            <span>
              <strong>{result?.graceLabel ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", {
                      annualPrincipal: result.firstYear.formattedAnnualPrincipal,
                      annualInterest: result.firstYear.formattedAnnualInterest
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
          {repaymentNotes.map((item, index) => (
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
