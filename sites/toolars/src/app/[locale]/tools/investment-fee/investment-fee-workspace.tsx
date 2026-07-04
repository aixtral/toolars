"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingDown } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateInvestmentFee,
  defaultInvestmentFeeScenario,
  type InvestmentFeeInput,
  type InvestmentFeeResult
} from "@/lib/tools/investment-fee";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "noAdvice", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const feeNotes = [
  "compare",
  "subtract",
  "variables"
] as const;

export function InvestmentFeeWorkspace() {
  const t = useTranslations("tools.investment-fee.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/investment-fee/about", localeCode);
  const [plan, setPlan] = useState(defaultInvestmentFeeScenario as InvestmentFeeInput);
  const [result, setResult] = useState(null as InvestmentFeeResult | null);

  const calculate = () => {
    setResult(calculateInvestmentFee(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.investment-fee.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof InvestmentFeeInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="investment-fee">
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
            <label className="field-label" htmlFor="fee-initial">
              {t("fields.initialInvestment")}
              <input className="input" id="fee-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} step="1" type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="fee-monthly">
              {t("fields.monthlyContribution")}
              <input className="input" id="fee-monthly" min={0} onChange={(event) => updateNumber("monthlyContribution", event.target.value)} step="1" type="number" value={plan.monthlyContribution} />
            </label>
            <label className="field-label" htmlFor="fee-return">
              {t("fields.annualReturn")}
              <input className="input" id="fee-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="fee-years">
              {t("fields.years")}
              <input className="input" id="fee-years" min={1} onChange={(event) => updateNumber("years", event.target.value)} step="1" type="number" value={plan.years} />
            </label>
            <label className="field-label" htmlFor="fee-rate">
              {t("fields.annualFee")}
              <input className="input" id="fee-rate" min={0} onChange={(event) => updateNumber("annualFee", event.target.value)} step="0.05" type="number" value={plan.annualFee} />
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
                      drag: result.formattedFeeDrag,
                      fee: `${plan.annualFee.toFixed(2)}%`
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.feeTone === "high" ? "warn" : "local"}`}>{result ? t(`badges.${result.feeTone}`) : t("badges.fees")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFeeDrag ?? "$0"}</strong>
              <span>{t("metrics.totalFeesEroded")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNoFeeValue ?? "$0"}</strong>
              <span>{t("metrics.withoutFees")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWithFeeValue ?? "$0"}</strong>
              <span>{t("metrics.withFees")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFeeAsEndValue ?? "0.0%"}</strong>
              <span>{t("metrics.feeAsEndValue")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingDown size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedTotalInvested ?? t("resultSection.waitingTitle")}</strong>
              <small>
                {result
                  ? t("resultSection.investedDetail", {
                      feeAsInvested: result.formattedFeeAsInvested,
                      realReturn: result.formattedRealAnnualReturn
                    })
                  : t("resultSection.waitingDescription")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {feeNotes.map((item, index) => (
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
