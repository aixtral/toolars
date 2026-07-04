"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Car, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCarLoan,
  defaultCarLoanScenario,
  type CarLoanInput,
  type CarLoanResult
} from "@/lib/tools/car-loan";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "estimate", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const ownershipNotes = ["formula", "downPayment", "ownership"] as const;

export function CarLoanWorkspace() {
  const t = useTranslations("tools.car-loan.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/car-loan/about", localeCode);
  const [plan, setPlan] = useState(defaultCarLoanScenario as CarLoanInput);
  const [result, setResult] = useState(null as CarLoanResult | null);

  const calculate = () => {
    setResult(calculateCarLoan(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.car-loan.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CarLoanInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="car-loan">
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
            <label className="field-label" htmlFor="car-price">
              {t("fields.vehiclePrice")}
              <input className="input" id="car-price" min={0} onChange={(event) => updateNumber("vehiclePrice", event.target.value)} step="500" type="number" value={plan.vehiclePrice} />
            </label>
            <label className="field-label" htmlFor="car-down">
              {t("fields.downPaymentPercent")}
              <input className="input" id="car-down" min={0} onChange={(event) => updateNumber("downPaymentPercent", event.target.value)} step="1" type="number" value={plan.downPaymentPercent} />
            </label>
            <label className="field-label" htmlFor="car-rate">
              {t("fields.annualInterestRate")}
              <input className="input" id="car-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="car-term">
              {t("fields.termMonths")}
              <select className="input" id="car-term" onChange={(event) => updateNumber("termMonths", event.target.value)} value={plan.termMonths}>
                <option value={36}>36 {t("options.months")}</option>
                <option value={48}>48 {t("options.months")}</option>
                <option value={60}>60 {t("options.months")}</option>
                <option value={72}>72 {t("options.months")}</option>
                <option value={84}>84 {t("options.months")}</option>
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
            <span className={`badge ${result?.interestTone === "high" ? "warn" : "local"}`}>{result?.interestTone ?? t("badges.loan")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyPayment ?? "$0"}</strong>
              <span>{t("metrics.monthlyPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoanAmount ?? "$0"}</strong>
              <span>{t("metrics.loanAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>{t("metrics.totalInterest")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTrueCost ?? "$0"}</strong>
              <span>{t("metrics.trueCost")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Car size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalPayment ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", { amount: result.formattedDownPayment })
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
          {ownershipNotes.map((item, index) => (
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
