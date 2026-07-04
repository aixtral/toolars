"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingDown } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateInflation,
  defaultInflationScenario,
  type InflationInput,
  type InflationResult
} from "@/lib/tools/inflation-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "scenario", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const assumptionNotes = [
  "purchasingPower",
  "inflationVariation",
  "breakEven"
] as const;

export function InflationCalculatorWorkspace() {
  const t = useTranslations("tools.inflation-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/inflation-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultInflationScenario);
  const [result, setResult] = useState<InflationResult | null>(null);

  const calculate = () => {
    setResult(calculateInflation(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.inflation-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InflationInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="inflation-calculator">
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
            <label className="field-label" htmlFor="inflation-amount">
              {t("fields.amount")}
              <input className="input" id="inflation-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="1" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="inflation-rate">
              {t("fields.annualInflationRate")}
              <input className="input" id="inflation-rate" min={0} onChange={(event) => updateNumber("annualInflationRate", event.target.value)} step="0.1" type="number" value={plan.annualInflationRate} />
            </label>
            <label className="field-label" htmlFor="inflation-years">
              {t("fields.years")}
              <input className="input" id="inflation-years" min={0} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
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
                      originalAmount: result.formattedOriginalAmount,
                      futurePurchasingPower: result.formattedFuturePurchasingPower,
                      years: result.years
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? t("badges.purchasingPower") : t("badges.scenario")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFuturePurchasingPower ?? "$0"}</strong>
              <span>{t("metrics.futurePurchasingPower")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOriginalAmount ?? "$0"}</strong>
              <span>{t("metrics.originalAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCumulativeInflation ?? "0.0%"}</strong>
              <span>{t("metrics.cumulativeInflation")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPurchasingPowerLoss ?? "$0"}</strong>
              <span>{t("metrics.purchasingPowerLoss")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingDown size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedBreakEvenReturn ?? t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.breakEvenDetail") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {assumptionNotes.map((item, index) => (
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
