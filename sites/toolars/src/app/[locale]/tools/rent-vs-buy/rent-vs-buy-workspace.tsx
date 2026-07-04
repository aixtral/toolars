"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Home, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateRentVsBuy,
  defaultRentVsBuyScenario,
  type RentVsBuyInput,
  type RentVsBuyResult
} from "@/lib/tools/rent-vs-buy";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "scenario", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const housingNotes = ["opportunity", "amortization", "localCosts"] as const;

export function RentVsBuyWorkspace() {
  const t = useTranslations("tools.rent-vs-buy.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): RentVsBuyInput => ({ ...defaultRentVsBuyScenario }));
  const [result, setResult] = useState(null as RentVsBuyResult | null);

  const calculate = () => {
    setResult(calculateRentVsBuy(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.rent-vs-buy.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RentVsBuyInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="rent-vs-buy">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={row.tone ? `badge ${row.tone}` : "badge"}>{t(`trustRows.${row.key}.label`)}</span>
              <span>{t(`trustRows.${row.key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/rent-vs-buy/about")}>
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
            <label className="field-label" htmlFor="rentbuy-home-price">
              {t("fields.homePrice")}
              <input className="input" id="rentbuy-home-price" min={0} onChange={(event) => updateNumber("homePrice", event.target.value)} step="1000" type="number" value={plan.homePrice} />
            </label>
            <label className="field-label" htmlFor="rentbuy-down">
              {t("fields.downPaymentPercent")}
              <input className="input" id="rentbuy-down" min={0} onChange={(event) => updateNumber("downPaymentPercent", event.target.value)} step="1" type="number" value={plan.downPaymentPercent} />
            </label>
            <label className="field-label" htmlFor="rentbuy-rate">
              {t("fields.mortgageRate")}
              <input className="input" id="rentbuy-rate" min={0} onChange={(event) => updateNumber("mortgageRate", event.target.value)} step="0.1" type="number" value={plan.mortgageRate} />
            </label>
            <label className="field-label" htmlFor="rentbuy-holding">
              {t("fields.annualHoldingCost")}
              <input className="input" id="rentbuy-holding" min={0} onChange={(event) => updateNumber("annualHoldingCost", event.target.value)} step="500" type="number" value={plan.annualHoldingCost} />
            </label>
            <label className="field-label" htmlFor="rentbuy-rent">
              {t("fields.monthlyRent")}
              <input className="input" id="rentbuy-rent" min={0} onChange={(event) => updateNumber("monthlyRent", event.target.value)} step="100" type="number" value={plan.monthlyRent} />
            </label>
            <label className="field-label" htmlFor="rentbuy-return">
              {t("fields.investmentReturn")}
              <input className="input" id="rentbuy-return" min={0} onChange={(event) => updateNumber("investmentReturn", event.target.value)} step="0.1" type="number" value={plan.investmentReturn} />
            </label>
            <label className="field-label" htmlFor="rentbuy-years">
              {t("fields.years")}
              <input className="input" id="rentbuy-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
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
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className={`badge ${result?.recommendation === "rent" ? "warn" : "local"}`}>{result?.recommendation ?? t("badges.compare")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.recommendationTitle ?? t("resultSection.notCalculated")}</strong>
              <span>{t("metrics.recommendation")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBuyingCost ?? t("resultSection.zeroAmount")}</strong>
              <span>{t("metrics.totalBuyingCost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedRentingCost ?? t("resultSection.zeroAmount")}</strong>
              <span>{t("metrics.totalRentingCost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyMortgage ?? t("resultSection.zeroMonthlyAmount")}</strong>
              <span>{t("metrics.monthlyMortgage")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Home size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedOpportunityCost ?? t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.calculatedDescription", { difference: result.formattedDifference, years: plan.years })
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
          {housingNotes.map((item, index) => (
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
