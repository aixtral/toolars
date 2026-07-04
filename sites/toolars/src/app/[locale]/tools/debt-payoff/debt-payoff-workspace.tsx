"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, CreditCard, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateDebtPayoff,
  defaultDebtPayoffScenario,
  type DebtPayoffInput,
  type DebtPayoffResult,
  type DebtPayoffStrategy
} from "@/lib/tools/debt-payoff";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const debtNotes = ["loop", "principal", "strategy"] as const;

export function DebtPayoffWorkspace() {
  const t = useTranslations("tools.debt-payoff.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/debt-payoff/about", localeCode);
  const [plan, setPlan] = useState((): DebtPayoffInput => ({ ...defaultDebtPayoffScenario }));
  const [result, setResult] = useState(null as DebtPayoffResult | null);

  const calculate = () => {
    setResult(calculateDebtPayoff(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.debt-payoff.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: "debtBalance" | "annualInterestRate" | "monthlyPayment", value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateStrategy = (value: string) => {
    setPlan((current) => ({ ...current, strategy: value as DebtPayoffStrategy }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="debt-payoff">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={`badge ${row.tone}`}>{t(`trustRows.${row.key}.label`)}</span>
              <span>{t(`trustRows.${row.key}.text`)}</span>
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
            <label className="field-label" htmlFor="debt-payoff-balance">
              {t("fields.totalDebt")}
              <input className="input" id="debt-payoff-balance" min={0} onChange={(event) => updateNumber("debtBalance", event.target.value)} type="number" value={plan.debtBalance} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-rate">
              {t("fields.annualInterestRate")}
              <input className="input" id="debt-payoff-rate" min={0} onChange={(event) => updateNumber("annualInterestRate", event.target.value)} step="0.1" type="number" value={plan.annualInterestRate} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-payment">
              {t("fields.monthlyPayment")}
              <input className="input" id="debt-payoff-payment" min={0} onChange={(event) => updateNumber("monthlyPayment", event.target.value)} type="number" value={plan.monthlyPayment} />
            </label>
            <label className="field-label" htmlFor="debt-payoff-strategy">
              {t("fields.strategy")}
              <select className="input" id="debt-payoff-strategy" onChange={(event) => updateStrategy(event.target.value)} value={plan.strategy}>
                <option value="avalanche">{t("fields.avalanche")}</option>
                <option value="snowball">{t("fields.snowball")}</option>
              </select>
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
            <span className="badge warn">{t("badges.debtPlan")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result && !result.isPaymentTooLow ? t("metrics.monthsValue", { count: result.monthsToPayoff }) : t("metrics.zeroMonths")}</strong>
              <span>{t("metrics.monthsToPayoff")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalInterest ?? "$0"}</strong>
              <span>{t("metrics.totalInterest")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalPaid ?? "$0"}</strong>
              <span>{t("metrics.totalPaid")}</span>
            </article>
            <article className="llm-metric">
              <strong>{plan.strategy === "snowball" ? t("metrics.snowball") : t("metrics.avalanche")}</strong>
              <span>{t("metrics.strategy")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CreditCard size={18} aria-hidden="true" />
            <span>
              <strong>
                {result
                  ? result.isPaymentTooLow
                    ? result.warning
                    : t("callout.firstMonthPrincipal", { principal: result.firstMonth.formattedPrincipal, interest: result.firstMonth.formattedInterest })
                  : t("callout.waitingTitle")}
              </strong>
              <small>{result ? result.strategyMessage : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {debtNotes.map((item, index) => (
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
