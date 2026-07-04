"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, WalletCards } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSocialInsurance,
  defaultSocialInsuranceScenario,
  type SocialInsuranceInput,
  type SocialInsuranceResult
} from "@/lib/tools/social-insurance-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "policy", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const policyNotes = [
  "contributionBase",
  "employee",
  "employer"
] as const;

export function SocialInsuranceCalculatorWorkspace() {
  const t = useTranslations("tools.social-insurance-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultSocialInsuranceScenario as SocialInsuranceInput);
  const [result, setResult] = useState(null as SocialInsuranceResult | null);

  const calculate = () => {
    setResult(calculateSocialInsurance(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.social-insurance-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof SocialInsuranceInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: value === "" ? undefined : Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="social-insurance-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/social-insurance-calculator/about")}>
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
            <label className="field-label" htmlFor="social-salary">
              {t("fields.salary")}
              <input className="input" id="social-salary" min={0} onChange={(event) => updateNumber("salary", event.target.value)} step="100" type="number" value={plan.salary} />
            </label>
            <label className="field-label" htmlFor="social-housing-rate">
              {t("fields.housingFundRate")}
              <select className="input" id="social-housing-rate" onChange={(event) => updateNumber("housingFundRate", event.target.value)} value={plan.housingFundRate}>
                <option value={0.05}>5%</option>
                <option value={0.07}>7%</option>
                <option value={0.08}>8%</option>
                <option value={0.1}>10%</option>
                <option value={0.12}>12%</option>
              </select>
            </label>
            <label className="field-label" htmlFor="social-base-min">
              {t("fields.baseMin")}
              <input className="input" id="social-base-min" min={0} onChange={(event) => updateNumber("baseMin", event.target.value)} placeholder={t("fields.autoPlaceholder")} step="100" type="number" value={plan.baseMin ?? ""} />
            </label>
            <label className="field-label" htmlFor="social-base-max">
              {t("fields.baseMax")}
              <input className="input" id="social-base-max" min={0} onChange={(event) => updateNumber("baseMax", event.target.value)} placeholder={t("fields.autoPlaceholder")} step="100" type="number" value={plan.baseMax ?? ""} />
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
                  ? t("resultSection.summary", { netSalary: result.formattedNetSalary })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.contributionTone === "high" ? "warn" : "local"}`}>
              {result ? t(`tones.${result.contributionTone}`) : t("badges.payroll")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNetSalary ?? "¥0"}</strong>
              <span>{t("metrics.netSalary")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEmployeeContribution ?? "¥0"}</strong>
              <span>{t("metrics.employeeContribution")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEmployerContribution ?? "¥0"}</strong>
              <span>{t("metrics.employerContribution")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTax ?? "¥0"}</strong>
              <span>{t("metrics.individualIncomeTax")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <WalletCards size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedHousingFundDeposit ?? t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.housingFundDetail", { base: result.formattedContributionBase }) : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {policyNotes.map((item, index) => (
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
