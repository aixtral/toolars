"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCreditScoreSimulation,
  defaultCreditScoreScenario,
  type CreditScoreAction,
  type CreditScoreInput,
  type CreditScoreResult
} from "@/lib/tools/credit-score-simulator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "educational", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const creditNotes = [
  "utilization",
  "history",
  "bureau"
] as const;

const actions: Array<{ key: CreditScoreAction; value: CreditScoreAction }> = [
  { key: "payoff", value: "payoff" },
  { key: "pay-half", value: "pay-half" },
  { key: "new-loan", value: "new-loan" },
  { key: "miss-payment", value: "miss-payment" },
  { key: "increase-limit", value: "increase-limit" },
  { key: "close-card", value: "close-card" }
];

const ratingKeys: Record<CreditScoreResult["rating"], string> = {
  Poor: "poor",
  Fair: "fair",
  Good: "good",
  "Very Good": "veryGood",
  Excellent: "excellent"
};

export function CreditScoreSimulatorWorkspace() {
  const t = useTranslations("tools.credit-score-simulator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/credit-score-simulator/about", localeCode);
  const [plan, setPlan] = useState(defaultCreditScoreScenario);
  const [result, setResult] = useState(null as CreditScoreResult | null);
  const integerFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });
  const percentFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    style: "percent"
  });

  const calculate = () => {
    setResult(calculateCreditScoreSimulation(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.credit-score-simulator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "currentScore" | "creditLimit" | "currentBalance", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateAction = (value: string) => {
    setPlan((current) => ({ ...current, action: value as CreditScoreAction }));
    setResult(null);
  };

  function formatInteger(value: number) {
    return integerFormatter.format(value);
  }

  function formatPercent(value: number) {
    return percentFormatter.format(value);
  }

  function formatScoreChange(value: number) {
    const sign = Math.sign(value);
    const prefix = sign === 1 ? "+" : sign === -1 ? "-" : "";

    return `${prefix}${formatInteger(Math.abs(value))}`;
  }

  return (
    <div className="llm-cost-layout" data-tool-workspace="credit-score-simulator">
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
            <label className="field-label" htmlFor="credit-score-current">
              {t("fields.currentScore")}
              <input className="input" id="credit-score-current" max={850} min={300} onChange={(event) => updateNumber("currentScore", event.target.value)} type="number" value={plan.currentScore} />
            </label>
            <label className="field-label" htmlFor="credit-score-limit">
              {t("fields.creditLimit")}
              <input className="input" id="credit-score-limit" min={1} onChange={(event) => updateNumber("creditLimit", event.target.value)} step="500" type="number" value={plan.creditLimit} />
            </label>
            <label className="field-label" htmlFor="credit-score-balance">
              {t("fields.currentBalance")}
              <input className="input" id="credit-score-balance" min={0} onChange={(event) => updateNumber("currentBalance", event.target.value)} step="100" type="number" value={plan.currentBalance} />
            </label>
            <label className="field-label" htmlFor="credit-score-action">
              {t("fields.action")}
              <select className="input" id="credit-score-action" onChange={(event) => updateAction(event.target.value)} value={plan.action}>
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>
                    {t(`actionOptions.${action.key}`)}
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
              <Calculator size={16} aria-hidden="true" /> {t("actions.simulate")}
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
                      action: t(`actionSummaryActions.${plan.action}`),
                      score: formatInteger(result.newScore)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result && result.scoreChange < 0 ? "warn" : "local"}`}>{result ? t(result.scoreChange < 0 ? "badges.risk" : "badges.impact") : t("badges.score")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatInteger(result.newScore) : formatInteger(0)}</strong>
              <span>{t("metrics.simulatedScore")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatScoreChange(result.scoreChange) : formatInteger(0)}</strong>
              <span>{t("metrics.scoreChange")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatPercent(result.currentUtilization) : formatPercent(0)}</strong>
              <span>{t("metrics.currentUtilization")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatPercent(result.newUtilization) : formatPercent(0)}</strong>
              <span>{t("metrics.newUtilization")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`ratings.${ratingKeys[result.rating]}`) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.rangeDescription", { action: t(`actionOptions.${plan.action}`), position: result.scoreRangePosition.toFixed(1) }) : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {creditNotes.map((item, index) => (
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
