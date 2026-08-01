"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Percent, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateDiscount,
  defaultDiscountScenario,
  type DiscountInput,
  type DiscountResult
} from "@/lib/tools/discount-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "context", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const checkoutNotes = ["discount", "tax", "checkout"] as const;

export function DiscountCalculatorWorkspace() {
  const t = useTranslations("tools.discount-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultDiscountScenario);
  const [result, setResult] = useState(null as DiscountResult | null);

  const calculate = () => {
    setResult(calculateDiscount(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.discount-calculator.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (key: keyof DiscountInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const resultSummary = result
    ? t("resultSection.summary", {
        discountPercent: Number.isInteger(result.discountPercent)
          ? `${result.discountPercent}%`
          : `${result.discountPercent.toFixed(2)}%`,
        originalPrice: result.formattedOriginalPrice
      })
    : t("resultSection.emptyDescription");

  return (
    <div className="llm-cost-layout" data-tool-workspace="discount-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/discount-calculator/about")}>
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
            <label className="field-label" htmlFor="discount-original">
              {t("fields.originalPrice")}
              <input className="input" id="discount-original" min={0} onChange={(event) => updateNumber("originalPrice", event.target.value)} step="0.01" type="number" value={plan.originalPrice} />
            </label>
            <label className="field-label" htmlFor="discount-percent">
              {t("fields.discountPercent")}
              <input className="input" id="discount-percent" min={0} onChange={(event) => updateNumber("discountPercent", event.target.value)} step="0.1" type="number" value={plan.discountPercent} />
            </label>
            <label className="field-label" htmlFor="discount-tax">
              {t("fields.taxPercent")}
              <input className="input" id="discount-tax" min={0} onChange={(event) => updateNumber("taxPercent", event.target.value)} step="0.1" type="number" value={plan.taxPercent} />
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge local">{result ? t("badges.checkout") : t("badges.sale")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFinalPrice ?? "$0.00"}</strong>
              <span>{t("metrics.finalPrice")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDiscountAmount ?? "$0.00"}</strong>
              <span>{t("metrics.discountAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTaxAmount ?? "$0.00"}</strong>
              <span>{t("metrics.taxAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedOriginalPrice ?? "$0.00"}</strong>
              <span>{t("metrics.originalPrice")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Percent size={18} aria-hidden="true" />
            <span>
              <strong>{result ? resultSummary : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("resultSection.beforeTax", { amount: result.formattedPriceAfterDiscount })
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
          {checkoutNotes.map((item, index) => (
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
