"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { apyCompoundingOptions, calculateApy, defaultApyScenario, type ApyInput, type ApyResult } from "@/lib/tools/apy-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const apyNotes = [
  "formula",
  "compounding",
  "comparison"
] as const;

const compoundingFrequencyKeys = {
  1: "annually",
  2: "semiAnnually",
  4: "quarterly",
  12: "monthly",
  52: "weekly",
  365: "daily"
} as const;

export function ApyCalculatorWorkspace() {
  const t = useTranslations("tools.apy-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(() => ({ ...defaultApyScenario }));
  const [result, setResult] = useState(null as ApyResult | null);

  const calculate = () => {
    setResult(calculateApy(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.apy-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof ApyInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const getFrequencyLabel = (periods: number) => {
    const key = compoundingFrequencyKeys[periods as keyof typeof compoundingFrequencyKeys];
    return key ? t(`compoundingFrequencies.${key}`) : t("compoundingFrequencies.custom", { periods });
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="apy-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/apy-calculator/about")}>
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
            <label className="field-label" htmlFor="apy-apr">
              {t("fields.apr")}
              <input className="input" id="apy-apr" min={0} onChange={(event) => updateNumber("aprPercent", event.target.value)} step="0.01" type="number" value={plan.aprPercent} />
            </label>
            <label className="field-label" htmlFor="apy-periods">
              {t("fields.compoundingPeriods")}
              <input className="input" id="apy-periods" min={1} onChange={(event) => updateNumber("compoundingPeriods", event.target.value)} type="number" value={plan.compoundingPeriods} />
            </label>
            <label className="field-label" htmlFor="apy-principal">
              {t("fields.principal")}
              <input className="input" id="apy-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} type="number" value={plan.principal} />
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
                      apy: result.formattedApy,
                      apr: result.formattedApr,
                      periods: plan.compoundingPeriods
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.effectiveYield")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedApy ?? "0.00%"}</strong>
              <span>{t("metrics.apy")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedApr ?? "0.00%"}</strong>
              <span>{t("metrics.apr")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedYearEndBalance ?? "$0"}</strong>
              <span>{t("metrics.yearEndBalance")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInterestEarned ?? "$0"}</strong>
              <span>{t("metrics.interestEarned")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.readyTitle") : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? result.comparisonRows.map((row) => t("callout.comparisonPair", { frequency: getFrequencyLabel(row.periods), apy: row.formattedApy })).join(" / ")
                  : apyCompoundingOptions.map((option) => getFrequencyLabel(option.periods)).join(" / ")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {apyNotes.map((item, index) => (
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
