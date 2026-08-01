"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateHourlyToSalary,
  defaultHourlyToSalaryScenario,
  type HourlyToSalaryInput,
  type HourlyToSalaryResult
} from "@/lib/tools/hourly-to-salary";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "gross", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const salaryNotes = ["formula", "overtime", "compare"] as const;

export function HourlyToSalaryWorkspace() {
  const t = useTranslations("tools.hourly-to-salary.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): HourlyToSalaryInput => ({ ...defaultHourlyToSalaryScenario }));
  const [result, setResult] = useState(null as HourlyToSalaryResult | null);

  const calculate = () => {
    setResult(calculateHourlyToSalary(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.hourly-to-salary.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (key: keyof HourlyToSalaryInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="hourly-to-salary">
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
          <a className="button button-outline" href={localizedHref("/tools/hourly-to-salary/about")}>
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
            <label className="field-label" htmlFor="salary-rate">
              {t("fields.hourlyRate")}
              <input className="input" id="salary-rate" min={0} onChange={(event) => updateNumber("hourlyRate", event.target.value)} step="0.01" type="number" value={plan.hourlyRate} />
            </label>
            <label className="field-label" htmlFor="salary-hours">
              {t("fields.hoursPerWeek")}
              <input className="input" id="salary-hours" min={0} onChange={(event) => updateNumber("hoursPerWeek", event.target.value)} step="0.1" type="number" value={plan.hoursPerWeek} />
            </label>
            <label className="field-label" htmlFor="salary-weeks">
              {t("fields.weeksPerYear")}
              <input className="input" id="salary-weeks" min={1} onChange={(event) => updateNumber("weeksPerYear", event.target.value)} step="0.1" type="number" value={plan.weeksPerYear} />
            </label>
            <label className="field-label" htmlFor="salary-overtime-hours">
              {t("fields.overtimeHours")}
              <input className="input" id="salary-overtime-hours" min={0} onChange={(event) => updateNumber("overtimeHoursPerWeek", event.target.value)} step="0.1" type="number" value={plan.overtimeHoursPerWeek} />
            </label>
            <label className="field-label" htmlFor="salary-overtime-multiplier">
              {t("fields.overtimeMultiplier")}
              <select className="input" id="salary-overtime-multiplier" onChange={(event) => updateNumber("overtimeMultiplier", event.target.value)} value={plan.overtimeMultiplier}>
                <option value={1}>{t("options.none")}</option>
                <option value={1.5}>{"1.5x"}</option>
                <option value={2}>{"2x"}</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
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
            <span className="badge local">{result ? t("badges.grossPay") : t("badges.pay")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAnnualSalary ?? "$0"}</strong>
              <span>{t("metrics.annualSalary")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySalary ?? "$0"}</strong>
              <span>{t("metrics.monthlySalary")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWeeklySalary ?? "$0"}</strong>
              <span>{t("metrics.weeklySalary")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOvertimePay ?? "$0"}</strong>
              <span>{t("metrics.overtimePay")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.grossPayCaveat") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {salaryNotes.map((item, index) => (
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
