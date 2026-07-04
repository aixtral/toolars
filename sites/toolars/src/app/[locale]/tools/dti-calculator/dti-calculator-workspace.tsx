"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateDti, defaultDtiScenario, type DtiInput, type DtiResult } from "@/lib/tools/dti-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const dtiNotes = [
  "frontEnd",
  "backEnd",
  "thresholds"
] as const;

export function DtiCalculatorWorkspace() {
  const t = useTranslations("tools.dti-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultDtiScenario);
  const [result, setResult] = useState(null as DtiResult | null);

  const calculate = () => {
    setResult(calculateDti(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.dti-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof DtiInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="dti-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/dti-calculator/about")}>
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
            <label className="field-label" htmlFor="dti-income">
              {t("fields.grossMonthlyIncome")}
              <input className="input" id="dti-income" min={0} onChange={(event) => updateNumber("grossMonthlyIncome", event.target.value)} type="number" value={plan.grossMonthlyIncome} />
            </label>
            <label className="field-label" htmlFor="dti-mortgage">
              {t("fields.mortgagePayment")}
              <input className="input" id="dti-mortgage" min={0} onChange={(event) => updateNumber("mortgagePayment", event.target.value)} type="number" value={plan.mortgagePayment} />
            </label>
            <label className="field-label" htmlFor="dti-debt">
              {t("fields.otherMonthlyDebt")}
              <input className="input" id="dti-debt" min={0} onChange={(event) => updateNumber("otherMonthlyDebt", event.target.value)} type="number" value={plan.otherMonthlyDebt} />
            </label>
            <label className="field-label" htmlFor="dti-housing">
              {t("fields.housingAddOns")}
              <input className="input" id="dti-housing" min={0} onChange={(event) => updateNumber("housingAddOns", event.target.value)} type="number" value={plan.housingAddOns} />
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
                      frontEnd: result.frontEndDtiPercent.toFixed(1),
                      backEnd: result.backEndDtiPercent.toFixed(1)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.healthTone === "high" ? "warn" : "local"}`}>
              {t(result?.healthTone === "high" ? "badges.highDti" : "badges.ratio")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? `${result.backEndDtiPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>{t("metrics.backEnd")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.frontEndDtiPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>{t("metrics.frontEnd")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalMonthlyPayments ?? "$0"}</strong>
              <span>{t("metrics.totalMonthlyPayments")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDisposableIncome ?? "$0"}</strong>
              <span>{t("metrics.disposableIncome")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`qualification.${result.healthTone}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {dtiNotes.map((item, index) => (
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
