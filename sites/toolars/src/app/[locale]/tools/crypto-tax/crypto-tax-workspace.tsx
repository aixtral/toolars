"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCryptoTax,
  defaultCryptoTaxScenario,
  type CryptoTaxInput,
  type CryptoTaxResult,
  type CryptoTaxTransaction
} from "@/lib/tools/crypto-tax";

const storageKey = "toolars.crypto-tax.transactions:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "taxCaveat", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const taxNotes = [
  "averageCost",
  "realizedPnl",
  "jurisdiction"
] as const;

export function CryptoTaxWorkspace() {
  const t = useTranslations("tools.crypto-tax.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(() => defaultCryptoTaxScenario);
  const [result, setResult] = useState(null as CryptoTaxResult | null);

  const calculate = () => {
    setResult(calculateCryptoTax(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateTransaction = (type: "buyTransactions" | "sellTransactions", index: number, key: keyof CryptoTaxTransaction, value: string) => {
    setValues((current) => ({
      ...current,
      [type]: current[type].map((transaction, transactionIndex) => (transactionIndex === index ? { ...transaction, [key]: Number(value) } : transaction))
    }));
    setResult(null);
  };

  const updateCurrentPrice = (value: string) => {
    setValues((current) => ({ ...current, currentPrice: Number(value) }));
    setResult(null);
  };

  const resultSummary = result
    ? t("resultSection.summary", {
        totalBought: result.totalBuyQuantity.toFixed(4),
        totalSold: result.totalSellQuantity.toFixed(4)
      })
    : null;

  return (
    <div className="llm-cost-layout" data-tool-workspace="crypto-tax">
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
          <a className="button button-outline" href={localizedHref("/tools/crypto-tax/about")}>
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
            {values.buyTransactions.map((transaction, index) => (
              <div className="input-pair" key={`buy-${index}`}>
                <label className="field-label" htmlFor={`crypto-buy-${index}-price`}>
                  {t("fields.buyPrice", { index: index + 1 })}
                  <input className="input" id={`crypto-buy-${index}-price`} min={0} onChange={(event) => updateTransaction("buyTransactions", index, "price", event.target.value)} step="0.01" type="number" value={transaction.price} />
                </label>
                <label className="field-label" htmlFor={`crypto-buy-${index}-quantity`}>
                  {t("fields.buyQuantity", { index: index + 1 })}
                  <input className="input" id={`crypto-buy-${index}-quantity`} min={0} onChange={(event) => updateTransaction("buyTransactions", index, "quantity", event.target.value)} step="0.0001" type="number" value={transaction.quantity} />
                </label>
              </div>
            ))}
            {values.sellTransactions.map((transaction, index) => (
              <div className="input-pair" key={`sell-${index}`}>
                <label className="field-label" htmlFor={`crypto-sell-${index}-price`}>
                  {t("fields.sellPrice", { index: index + 1 })}
                  <input className="input" id={`crypto-sell-${index}-price`} min={0} onChange={(event) => updateTransaction("sellTransactions", index, "price", event.target.value)} step="0.01" type="number" value={transaction.price} />
                </label>
                <label className="field-label" htmlFor={`crypto-sell-${index}-quantity`}>
                  {t("fields.sellQuantity", { index: index + 1 })}
                  <input className="input" id={`crypto-sell-${index}-quantity`} min={0} onChange={(event) => updateTransaction("sellTransactions", index, "quantity", event.target.value)} step="0.0001" type="number" value={transaction.quantity} />
                </label>
              </div>
            ))}
            <label className="field-label" htmlFor="crypto-current-price">
              {t("fields.currentPrice")}
              <input className="input" id="crypto-current-price" min={0} onChange={(event) => updateCurrentPrice(event.target.value)} step="0.01" type="number" value={values.currentPrice} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
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
                {resultSummary ?? t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.taxReference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAverageCostBasis ?? "$0.00"}</strong>
              <span>{t("metrics.averageCostBasis")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRealizedPnl ?? "$0.00"}</strong>
              <span>{t("metrics.realizedPnl")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedUnrealizedPnl ?? "$0.00"}</strong>
              <span>{t("metrics.unrealizedPnl")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRemainingQuantity ?? "0.0000"}</strong>
              <span>{t("metrics.remainingQuantity")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{resultSummary ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
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
            <ShieldCheck size={16} aria-hidden="true" /> {t("recommendation.title")}
          </strong>
          <p>{t("recommendation.body")}</p>
        </div>
      </aside>
    </div>
  );
}
