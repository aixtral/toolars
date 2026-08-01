"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateStockAverage,
  defaultStockAverageScenario,
  type StockAverageInput,
  type StockAverageResult
} from "@/lib/tools/stock-average";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "noAdvice", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const costBasisNotes = [
  "average",
  "exclusions",
  "records"
] as const;

export function StockAverageWorkspace() {
  const t = useTranslations("tools.stock-average.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultStockAverageScenario as StockAverageInput);
  const [result, setResult] = useState(null as StockAverageResult | null);
  const resultSummary = result
    ? t("resultSection.summary", {
        shares: result.formattedTotalShares,
        averagePrice: result.formattedAveragePrice
      })
    : t("resultSection.emptyDescription");

  const calculate = () => {
    setResult(calculateStockAverage(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.stock-average.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateLot = (index: number, key: "shares" | "pricePerShare", value: string) => {
    setPlan((current) => ({
      purchases: current.purchases.map((lot, lotIndex) => (lotIndex === index ? { ...lot, [key]: Number(value) } : lot))
    }));
    setResult(null);
  };

  const addLot = () => {
    setPlan((current) => ({ purchases: [...current.purchases, { shares: 0, pricePerShare: 0 }] }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="stock-average">
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
          <a className="button button-outline" href={localizedHref("/tools/stock-average/about")}>
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

          <div className="workspace-stack" style={{ gap: 14 }}>
            {plan.purchases.map((lot, index) => (
              <div className="llm-input-grid" key={index}>
                <label className="field-label" htmlFor={`stock-shares-${index}`}>
                  {t("fields.lotShares", { lot: index + 1 })}
                  <input className="input" id={`stock-shares-${index}`} min={0} onChange={(event) => updateLot(index, "shares", event.target.value)} step="0.01" type="number" value={lot.shares} />
                </label>
                <label className="field-label" htmlFor={`stock-price-${index}`}>
                  {t("fields.lotPricePerShare", { lot: index + 1 })}
                  <input className="input" id={`stock-price-${index}`} min={0} onChange={(event) => updateLot(index, "pricePerShare", event.target.value)} step="0.01" type="number" value={lot.pricePerShare} />
                </label>
              </div>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={addLot} type="button">
              {t("actions.addPurchase")}
            </button>
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge local">{result ? t("badges.costBasis") : t("badges.portfolio")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedAveragePrice ?? "$0.00"}</strong>
              <span>{t("metrics.averageCost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalShares ?? "0"}</strong>
              <span>{t("metrics.totalShares")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalCost ?? "$0.00"}</strong>
              <span>{t("metrics.totalCost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBreakevenPrice ?? "$0.00"}</strong>
              <span>{t("metrics.breakeven")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? resultSummary : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.costBasisDetail") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {costBasisNotes.map((item, index) => (
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
