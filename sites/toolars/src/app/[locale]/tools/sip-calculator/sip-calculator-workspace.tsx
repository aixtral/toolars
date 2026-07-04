"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateSipReturns, defaultSipScenario, type SipInput, type SipResult } from "@/lib/tools/sip-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "estimate", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const sipNotes = [
  "monthlyRate",
  "zeroReturn",
  "marketRisk"
] as const;

export function SipCalculatorWorkspace() {
  const t = useTranslations("tools.sip-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): SipInput => defaultSipScenario);
  const [result, setResult] = useState(null as SipResult | null);

  const calculate = () => {
    setResult(calculateSipReturns(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.sip-calculator.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof SipInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="sip-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/sip-calculator/about")}>
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
            <label className="field-label" htmlFor="sip-monthly">
              {t("fields.monthlyInvestment")}
              <input className="input" id="sip-monthly" min={0} onChange={(event) => updateNumber("monthlyInvestment", event.target.value)} type="number" value={plan.monthlyInvestment} />
            </label>
            <label className="field-label" htmlFor="sip-return">
              {t("fields.annualReturn")}
              <input className="input" id="sip-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="sip-years">
              {t("fields.years")}
              <input className="input" id="sip-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="sip-principal">
              {t("fields.initialPrincipal")}
              <input className="input" id="sip-principal" min={0} onChange={(event) => updateNumber("initialPrincipal", event.target.value)} type="number" value={plan.initialPrincipal} />
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
                      monthlyInvestment: `$${Math.round(Math.max(0, plan.monthlyInvestment)).toLocaleString("en-US")}`,
                      totalValue: result.formattedTotalValue,
                      years: result.schedule.length
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? t("badges.projection") : t("badges.sip")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalValue ?? "$0"}</strong>
              <span>{t("metrics.totalValue")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInvested ?? "$0"}</strong>
              <span>{t("metrics.totalInvested")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReturnRate ?? "0.0%"}</strong>
              <span>{t("metrics.returnRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInvestmentReturns ?? "$0"}</strong>
              <span>{t("metrics.investmentReturns")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.yearlyRows", { count: result.schedule.length }) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {sipNotes.map((item, index) => (
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
