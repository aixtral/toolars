"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateMortgageRefinance,
  defaultMortgageRefinanceScenario,
  type MortgageRefinanceInput,
  type MortgageRefinanceResult
} from "@/lib/tools/mortgage-refinance-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "scenario", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const refinanceNotes = ["comparison", "interest", "caveats"] as const;
const termOptions = [
  { value: 5, key: "years5" },
  { value: 10, key: "years10" },
  { value: 15, key: "years15" },
  { value: 20, key: "years20" },
  { value: 25, key: "years25" },
  { value: 30, key: "years30" }
] as const;

export function MortgageRefinanceCalculatorWorkspace() {
  const t = useTranslations("tools.mortgage-refinance-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultMortgageRefinanceScenario);
  const [result, setResult] = useState(null as MortgageRefinanceResult | null);

  const calculate = () => {
    setResult(calculateMortgageRefinance(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.mortgage-refinance-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof MortgageRefinanceInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="mortgage-refinance-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/mortgage-refinance-calculator/about")}>
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
            <label className="field-label" htmlFor="refi-balance">
              {t("fields.currentBalance")}
              <input className="input" id="refi-balance" min={0} onChange={(event) => updateNumber("currentBalance", event.target.value)} step="1000" type="number" value={plan.currentBalance} />
            </label>
            <label className="field-label" htmlFor="refi-current-rate">
              {t("fields.currentAnnualInterestRate")}
              <input className="input" id="refi-current-rate" min={0} onChange={(event) => updateNumber("currentAnnualInterestRate", event.target.value)} step="0.05" type="number" value={plan.currentAnnualInterestRate} />
            </label>
            <label className="field-label" htmlFor="refi-current-years">
              {t("fields.currentRemainingYears")}
              <select className="input" id="refi-current-years" onChange={(event) => updateNumber("currentRemainingYears", event.target.value)} value={plan.currentRemainingYears}>
                {termOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`termOptions.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="refi-new-rate">
              {t("fields.newAnnualInterestRate")}
              <input className="input" id="refi-new-rate" min={0} onChange={(event) => updateNumber("newAnnualInterestRate", event.target.value)} step="0.05" type="number" value={plan.newAnnualInterestRate} />
            </label>
            <label className="field-label" htmlFor="refi-new-years">
              {t("fields.newLoanTermYears")}
              <select className="input" id="refi-new-years" onChange={(event) => updateNumber("newLoanTermYears", event.target.value)} value={plan.newLoanTermYears}>
                {termOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`termOptions.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="refi-cost">
              {t("fields.refinancingCost")}
              <input className="input" id="refi-cost" min={0} onChange={(event) => updateNumber("refinancingCost", event.target.value)} step="1000" type="number" value={plan.refinancingCost} />
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
            <span className={`badge ${result?.statusTone === "worthwhile" ? "local" : "warn"}`}>{result?.statusTitle ?? t("badges.refi")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySavings ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.monthlySavings")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOldMonthly ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.oldPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNewMonthly ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.newPayment")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.breakEvenLabel ?? t("metrics.emptyBreakEven")}</strong>
              <span>{t("metrics.breakEven")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalInterestSaved ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? `${result.guidance} ${t("callout.calculatedDescription", { oldInterest: result.formattedOldInterest, newInterest: result.formattedNewInterest })}`
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
          {refinanceNotes.map((item, index) => (
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
