"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PiggyBank, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateEmergencyFund,
  defaultEmergencyFundScenario,
  emergencyCoverageOptions,
  emergencyTimelineOptions,
  type EmergencyFundInput,
  type EmergencyFundResult
} from "@/lib/tools/emergency-fund";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const emergencyNotes = [
  "coverage",
  "liquidity",
  "essential"
] as const;

export function EmergencyFundWorkspace() {
  const t = useTranslations("tools.emergency-fund.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultEmergencyFundScenario);
  const [result, setResult] = useState(null as EmergencyFundResult | null);

  const calculate = () => {
    setResult(calculateEmergencyFund(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.emergency-fund.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof EmergencyFundInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="emergency-fund">
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
          <a className="button button-outline" href={localizedHref("/tools/emergency-fund/about")}>
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
            <label className="field-label" htmlFor="emergency-expenses">
              {t("fields.monthlyExpenses")}
              <input className="input" id="emergency-expenses" min={0} onChange={(event) => updateNumber("monthlyExpenses", event.target.value)} type="number" value={plan.monthlyExpenses} />
            </label>
            <label className="field-label" htmlFor="emergency-coverage">
              {t("fields.coverageMonths")}
              <select className="input" id="emergency-coverage" onChange={(event) => updateNumber("coverageMonths", event.target.value)} value={plan.coverageMonths}>
                {emergencyCoverageOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="emergency-savings">
              {t("fields.currentSavings")}
              <input className="input" id="emergency-savings" min={0} onChange={(event) => updateNumber("currentSavings", event.target.value)} type="number" value={plan.currentSavings} />
            </label>
            <label className="field-label" htmlFor="emergency-timeline">
              {t("fields.targetTimeline")}
              <select className="input" id="emergency-timeline" onChange={(event) => updateNumber("targetTimelineMonths", event.target.value)} value={plan.targetTimelineMonths}>
                {emergencyTimelineOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
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
                {result
                  ? t("resultSection.summary", {
                      months: plan.coverageMonths,
                      expenses: formatCurrency(plan.monthlyExpenses)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.planning")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTarget ?? "$0"}</strong>
              <span>{t("metrics.target")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGap ?? "$0"}</strong>
              <span>{t("metrics.gap")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySavingsNeeded ?? "$0"}</strong>
              <span>{t("metrics.monthlyNeeded")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.progressPercent.toFixed(1)}%` : "0%"}</strong>
              <span>{t("metrics.currentProgress")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PiggyBank size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("resultSection.progressTitle", { progress: result.progressLabel }) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.liquidityDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {emergencyNotes.map((item, index) => (
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

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
