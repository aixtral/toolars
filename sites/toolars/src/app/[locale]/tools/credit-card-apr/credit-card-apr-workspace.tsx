"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCreditCardApr,
  defaultCreditCardAprScenario,
  type CreditCardAprInput,
  type CreditCardAprResult
} from "@/lib/tools/credit-card-apr";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "terms", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const creditCostNotes = [
  "trueApr",
  "irr",
  "disclosures"
] as const;

export function CreditCardAprWorkspace() {
  const t = useTranslations("tools.credit-card-apr.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultCreditCardAprScenario);
  const [result, setResult] = useState(null as CreditCardAprResult | null);

  const calculate = () => {
    setResult(calculateCreditCardApr(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.credit-card-apr.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "amount" | "monthlyFeeRate", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updatePayments = (value: string) => {
    setPlan((current) => ({ ...current, payments: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="credit-card-apr">
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
          <a className="button button-outline" href={localizedHref("/tools/credit-card-apr/about")}>
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
            <label className="field-label" htmlFor="apr-amount">
              {t("fields.amount")}
              <input className="input" id="apr-amount" min={0} onChange={(event) => updateNumber("amount", event.target.value)} step="1" type="number" value={plan.amount} />
            </label>
            <label className="field-label" htmlFor="apr-payments">
              {t("fields.payments")}
              <select className="input" id="apr-payments" onChange={(event) => updatePayments(event.target.value)} value={plan.payments}>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </label>
            <label className="field-label" htmlFor="apr-fee-rate">
              {t("fields.monthlyFeeRate")}
              <input className="input" id="apr-fee-rate" min={0} onChange={(event) => updateNumber("monthlyFeeRate", event.target.value)} step="0.01" type="number" value={plan.monthlyFeeRate} />
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
                      apr: result.formattedApr,
                      monthlyFeeRate: result.monthlyFeeRate.toFixed(2)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.guidanceTone === "high" ? "warn" : "local"}`}>{result ? t(`badges.${result.guidanceTone}`) : t("badges.apr")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedApr ?? "0.00%"}</strong>
              <span>{t("metrics.estimatedApr")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNominalTotalRate ?? "0.00%"}</strong>
              <span>{t("metrics.nominalTotalRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalFees ?? "$0"}</strong>
              <span>{t("metrics.totalFees")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalPayment ?? "$0"}</strong>
              <span>{t("metrics.totalPayment")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedMonthlyPayment ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t(`guidance.${result.guidanceTone}`) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {creditCostNotes.map((item, index) => (
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
