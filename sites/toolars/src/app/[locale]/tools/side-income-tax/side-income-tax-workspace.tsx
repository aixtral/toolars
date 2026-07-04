"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Receipt, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSideIncomeTax,
  defaultSideIncomeTaxScenario,
  type SideIncomeFilingStatus,
  type SideIncomeTaxInput,
  type SideIncomeTaxResult
} from "@/lib/tools/side-income-tax";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "taxEstimate", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const taxNotes = ["selfEmployment", "deductions", "filing"] as const;

export function SideIncomeTaxWorkspace() {
  const t = useTranslations("tools.side-income-tax.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/side-income-tax/about", localeCode);
  const [plan, setPlan] = useState(defaultSideIncomeTaxScenario as SideIncomeTaxInput);
  const [result, setResult] = useState(null as SideIncomeTaxResult | null);

  const calculate = () => {
    setResult(calculateSideIncomeTax(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.side-income-tax.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Omit<SideIncomeTaxInput, "filingStatus">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateStatus = (value: SideIncomeFilingStatus) => {
    setPlan((current) => ({ ...current, filingStatus: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="side-income-tax">
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
            <label className="field-label" htmlFor="side-salary">
              {t("fields.salary")}
              <input className="input" id="side-salary" min={0} onChange={(event) => updateNumber("salary", event.target.value)} step="1000" type="number" value={plan.salary} />
            </label>
            <label className="field-label" htmlFor="side-income">
              {t("fields.sideIncome")}
              <input className="input" id="side-income" min={0} onChange={(event) => updateNumber("sideIncome", event.target.value)} step="1000" type="number" value={plan.sideIncome} />
            </label>
            <label className="field-label" htmlFor="side-expenses">
              {t("fields.businessExpenses")}
              <input className="input" id="side-expenses" min={0} onChange={(event) => updateNumber("businessExpenses", event.target.value)} step="500" type="number" value={plan.businessExpenses} />
            </label>
            <label className="field-label" htmlFor="side-retirement">
              {t("fields.retirementContribution")}
              <input className="input" id="side-retirement" min={0} onChange={(event) => updateNumber("retirementContribution", event.target.value)} step="500" type="number" value={plan.retirementContribution} />
            </label>
            <label className="field-label" htmlFor="side-status">
              {t("fields.filingStatus")}
              <select className="input" id="side-status" onChange={(event) => updateStatus(event.target.value as SideIncomeFilingStatus)} value={plan.filingStatus}>
                <option value="single">{t("filingStatuses.single")}</option>
                <option value="mfj">{t("filingStatuses.mfj")}</option>
                <option value="mfs">{t("filingStatuses.mfs")}</option>
                <option value="hoh">{t("filingStatuses.hoh")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="side-state-rate">
              {t("fields.stateTaxRate")}
              <input className="input" id="side-state-rate" min={0} onChange={(event) => updateNumber("stateTaxRate", event.target.value)} step="0.5" type="number" value={plan.stateTaxRate} />
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
            <span className={`badge ${result?.taxTone === "high" ? "warn" : "local"}`}>{result?.taxTone ?? t("badges.tax")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedSelfEmploymentTax ?? "$0"}</strong>
              <span>{t("metrics.selfEmploymentTax")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFederalAndStateTax ?? "$0"}</strong>
              <span>{t("metrics.federalAndStateTax")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEffectiveRate ?? "0.0%"}</strong>
              <span>{t("metrics.effectiveTaxRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedQuarterlyPayment ?? "$0"}</strong>
              <span>{t("metrics.quarterlyPayment")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Receipt size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTaxableIncome ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", { amount: result.formattedNetSelfEmploymentIncome })
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
          {taxNotes.map((item, index) => (
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
