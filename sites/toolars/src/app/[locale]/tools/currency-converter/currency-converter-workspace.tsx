"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCurrencyConversion,
  currencyOptions,
  defaultCurrencyScenario,
  type CurrencyCode,
  type CurrencyInput,
  type CurrencyResult
} from "@/lib/tools/currency-converter";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "rates", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const rateNotes = ["formula", "costs", "freshness"] as const;

export function CurrencyConverterWorkspace() {
  const t = useTranslations("tools.currency-converter.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const [plan, setPlan] = useState(defaultCurrencyScenario as CurrencyInput);
  const [result, setResult] = useState(null as CurrencyResult | null);

  const calculate = () => {
    setResult(calculateCurrencyConversion(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.currency-converter.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "amount" | "exchangeRate", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateCurrency = (key: "fromCurrency" | "toCurrency", value: string) => {
    setPlan((current) => ({ ...current, [key]: value as CurrencyCode }));
    setResult(null);
  };

  const rateDisplay = result
    ? t("callout.rateDisplay", {
        fromCurrency: result.fromCurrency,
        rate: result.exchangeRate.toLocaleString("en-US", { maximumFractionDigits: 6 }),
        toCurrency: result.toCurrency
      })
    : t("callout.waitingTitle");

  return (
    <div className="llm-cost-layout" data-tool-workspace="currency-converter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map(({ key, tone }) => (
            <div className="profile-row" key={key}>
              <span className={tone ? `badge ${tone}` : "badge"}>{t(`trustRows.${key}.label`)}</span>
              <span>{t(`trustRows.${key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/currency-converter/about")}>
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
            <label className="field-label" htmlFor="currency-amount">
              {t("fields.amount")}
              <input className="input" id="currency-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="0.01" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="currency-rate">
              {t("fields.exchangeRate")}
              <input className="input" id="currency-rate" min={0} onChange={(event) => updateNumber("exchangeRate", event.target.value)} step="0.0001" type="number" value={plan.exchangeRate} />
            </label>
            <label className="field-label" htmlFor="currency-from">
              {t("fields.fromCurrency")}
              <select className="input" id="currency-from" onChange={(event) => updateCurrency("fromCurrency", event.target.value)} value={plan.fromCurrency}>
                {currencyOptions.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {t("currencyOptionLabel", { code: currency.code, name: t(`currencyNames.${currency.code}`) })}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="currency-to">
              {t("fields.toCurrency")}
              <select className="input" id="currency-to" onChange={(event) => updateCurrency("toCurrency", event.target.value)} value={plan.toCurrency}>
                {currencyOptions.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {t("currencyOptionLabel", { code: currency.code, name: t(`currencyNames.${currency.code}`) })}
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
              <Calculator size={16} aria-hidden="true" /> {t("actions.convert")}
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
                      sourceAmount: result.formattedSourceAmount,
                      convertedAmount: result.formattedConvertedAmount
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">
              {result
                ? t("resultSection.pair", { fromCurrency: result.fromCurrency, toCurrency: result.toCurrency })
                : t("badges.fx")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedConvertedAmount ?? "0"}</strong>
              <span>{t("metrics.convertedAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSourceAmount ?? "0"}</strong>
              <span>{t("metrics.sourceAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fromCurrency ?? plan.fromCurrency}</strong>
              <span>{t("metrics.from")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.toCurrency ?? plan.toCurrency}</strong>
              <span>{t("metrics.to")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{rateDisplay}</strong>
              <small>{result ? t("callout.currentRateDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {rateNotes.map((item, index) => (
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
