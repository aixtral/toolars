"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TimerReset } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateFreelanceRate,
  defaultFreelanceRateScenario,
  type FreelanceRateInput,
  type FreelanceRateResult
} from "@/lib/tools/freelance-rate";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "pricing", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const pricingNotes = ["billable", "revenue", "project"] as const;
const nonBillableOptions = [
  { value: 0.2, key: "stable" },
  { value: 0.3, key: "normal" },
  { value: 0.4, key: "heavy" },
  { value: 0.5, key: "transition" }
] as const;
const locationFactorOptions = [
  { value: 1, key: "remote" },
  { value: 1.2, key: "tier2" },
  { value: 1.4, key: "tier1" },
  { value: 1.8, key: "intl" }
] as const;

export function FreelanceRateWorkspace() {
  const t = useTranslations("tools.freelance-rate.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/freelance-rate/about", localeCode);
  const [plan, setPlan] = useState(defaultFreelanceRateScenario);
  const [result, setResult] = useState<FreelanceRateResult | null>(null);

  const calculate = () => {
    setResult(calculateFreelanceRate(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.freelance-rate.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof FreelanceRateInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="freelance-rate">
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
            <label className="field-label" htmlFor="freelance-income">
              {t("fields.goalIncome")}
              <input className="input" id="freelance-income" min={0} onChange={(event) => updateNumber("goalIncome", event.target.value)} step="1000" type="number" value={plan.goalIncome} />
            </label>
            <label className="field-label" htmlFor="freelance-vacation">
              {t("fields.vacationDays")}
              <input className="input" id="freelance-vacation" min={0} onChange={(event) => updateNumber("vacationDays", event.target.value)} step="1" type="number" value={plan.vacationDays} />
            </label>
            <label className="field-label" htmlFor="freelance-hours">
              {t("fields.weeklyWorkHours")}
              <input className="input" id="freelance-hours" min={0} onChange={(event) => updateNumber("weeklyWorkHours", event.target.value)} step="1" type="number" value={plan.weeklyWorkHours} />
            </label>
            <label className="field-label" htmlFor="freelance-nonbillable">
              {t("fields.nonBillableRatio")}
              <select className="input" id="freelance-nonbillable" onChange={(event) => updateNumber("nonBillableRatio", event.target.value)} value={plan.nonBillableRatio}>
                {nonBillableOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.nonBillable.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="freelance-tax">
              {t("fields.taxRate")}
              <input className="input" id="freelance-tax" min={0} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
            </label>
            <label className="field-label" htmlFor="freelance-insurance">
              {t("fields.insuranceCost")}
              <input className="input" id="freelance-insurance" min={0} onChange={(event) => updateNumber("insuranceCost", event.target.value)} step="100" type="number" value={plan.insuranceCost} />
            </label>
            <label className="field-label" htmlFor="freelance-ops">
              {t("fields.operatingCost")}
              <input className="input" id="freelance-ops" min={0} onChange={(event) => updateNumber("operatingCost", event.target.value)} step="100" type="number" value={plan.operatingCost} />
            </label>
            <label className="field-label" htmlFor="freelance-location">
              {t("fields.locationFactor")}
              <select className="input" id="freelance-location" onChange={(event) => updateNumber("locationFactor", event.target.value)} value={plan.locationFactor}>
                {locationFactorOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.locationFactor.${option.key}`)}
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
              <p className="tool-description">
                {result ? t("resultSection.calculatedDescription", { hourlyRate: result.formattedHourlyRate }) : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.rateTone === "high" ? "warn" : "local"}`}>
              {result ? t(`rateTones.${result.rateTone}`) : t("badges.rate")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedHourlyRate ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.hourlyRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDailyRate ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.dailyRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProjectRate ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.projectRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPremiumRate ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.premiumRate")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TimerReset size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.billableHours", { count: result.billableHours }) : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", { nonBillableHours: result.nonBillableHours, totalWorkHours: result.totalWorkHours })
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
          {pricingNotes.map((item, index) => (
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
