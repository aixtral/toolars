"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateIncomeTax,
  defaultIncomeTaxScenario,
  type IncomeTaxInput,
  type IncomeTaxResult
} from "@/lib/tools/income-tax";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "noAdvice", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const taxNotes = [
  "taxableIncome",
  "flatRate",
  "jurisdiction"
] as const;

export function IncomeTaxWorkspace() {
  const t = useTranslations("tools.income-tax.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/income-tax/about", localeCode);
  const [plan, setPlan] = useState(defaultIncomeTaxScenario);
  const [result, setResult] = useState<IncomeTaxResult | null>(null);

  const calculate = () => {
    setResult(calculateIncomeTax(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.income-tax.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof IncomeTaxInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="income-tax">
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
            <label className="field-label" htmlFor="tax-salary">
              {t("fields.monthlySalary")}
              <input className="input" id="tax-salary" min={0} onChange={(event) => updateNumber("monthlySalary", event.target.value)} step="1" type="number" value={plan.monthlySalary} />
            </label>
            <label className="field-label" htmlFor="tax-rate">
              {t("fields.taxRate")}
              <input className="input" id="tax-rate" min={0} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
            </label>
            <label className="field-label" htmlFor="tax-deduction">
              {t("fields.monthlyDeduction")}
              <input className="input" id="tax-deduction" min={0} onChange={(event) => updateNumber("monthlyDeduction", event.target.value)} step="1" type="number" value={plan.monthlyDeduction} />
            </label>
            <label className="field-label" htmlFor="tax-extra">
              {t("fields.extraWithheld")}
              <input className="input" id="tax-extra" min={0} onChange={(event) => updateNumber("extraWithheld", event.target.value)} step="1" type="number" value={plan.extraWithheld} />
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
                      grossIncome: result.formattedMonthlyGrossIncome,
                      netIncome: result.formattedMonthlyNetIncome
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? t("badges.flatRate") : t("badges.tax")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyNetIncome ?? "$0"}</strong>
              <span>{t("metrics.monthlyNetIncome")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyTax ?? "$0"}</strong>
              <span>{t("metrics.monthlyTax")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyDeductions ?? "$0"}</strong>
              <span>{t("metrics.deductions")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualNetIncome ?? "$0"}</strong>
              <span>{t("metrics.annualNetIncome")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedEffectiveRate ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {taxNotes.map((item, index) => (
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
