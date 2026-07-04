"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateNetWorth,
  defaultNetWorthScenario,
  type NetWorthInput,
  type NetWorthResult
} from "@/lib/tools/net-worth-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const netWorthNotes = ["definition", "trend", "negative"] as const;

export function NetWorthCalculatorWorkspace() {
  const t = useTranslations("tools.net-worth-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/net-worth-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultNetWorthScenario as NetWorthInput);
  const [result, setResult] = useState(null as NetWorthResult | null);

  const calculate = () => {
    setResult(calculateNetWorth(plan));
  };

  const saveSnapshot = () => {
    window.localStorage.setItem("toolars.net-worth-calculator.snapshot", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof NetWorthInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="net-worth-calculator">
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
            <label className="field-label" htmlFor="net-worth-home">
              {t("fields.homeValue")}
              <input className="input" id="net-worth-home" min={0} onChange={(event) => updateNumber("homeValue", event.target.value)} type="number" value={plan.homeValue} />
            </label>
            <label className="field-label" htmlFor="net-worth-investments">
              {t("fields.investments")}
              <input className="input" id="net-worth-investments" min={0} onChange={(event) => updateNumber("investments", event.target.value)} type="number" value={plan.investments} />
            </label>
            <label className="field-label" htmlFor="net-worth-cash">
              {t("fields.cashSavings")}
              <input className="input" id="net-worth-cash" min={0} onChange={(event) => updateNumber("cashSavings", event.target.value)} type="number" value={plan.cashSavings} />
            </label>
            <label className="field-label" htmlFor="net-worth-car">
              {t("fields.vehicleValue")}
              <input className="input" id="net-worth-car" min={0} onChange={(event) => updateNumber("vehicleValue", event.target.value)} type="number" value={plan.vehicleValue} />
            </label>
            <label className="field-label" htmlFor="net-worth-other-assets">
              {t("fields.otherAssets")}
              <input className="input" id="net-worth-other-assets" min={0} onChange={(event) => updateNumber("otherAssets", event.target.value)} type="number" value={plan.otherAssets} />
            </label>
            <label className="field-label" htmlFor="net-worth-mortgage">
              {t("fields.mortgageBalance")}
              <input className="input" id="net-worth-mortgage" min={0} onChange={(event) => updateNumber("mortgageBalance", event.target.value)} type="number" value={plan.mortgageBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-car-loan">
              {t("fields.carLoanBalance")}
              <input className="input" id="net-worth-car-loan" min={0} onChange={(event) => updateNumber("carLoanBalance", event.target.value)} type="number" value={plan.carLoanBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-credit-card">
              {t("fields.creditCardDebt")}
              <input className="input" id="net-worth-credit-card" min={0} onChange={(event) => updateNumber("creditCardDebt", event.target.value)} type="number" value={plan.creditCardDebt} />
            </label>
            <label className="field-label" htmlFor="net-worth-student-loan">
              {t("fields.studentLoanBalance")}
              <input className="input" id="net-worth-student-loan" min={0} onChange={(event) => updateNumber("studentLoanBalance", event.target.value)} type="number" value={plan.studentLoanBalance} />
            </label>
            <label className="field-label" htmlFor="net-worth-other-debts">
              {t("fields.otherDebts")}
              <input className="input" id="net-worth-other-debts" min={0} onChange={(event) => updateNumber("otherDebts", event.target.value)} type="number" value={plan.otherDebts} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
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
            <span className={`badge ${result?.healthTone === "negative" ? "warn" : "local"}`}>
              {result?.healthTone === "negative" ? t("badges.debtFocus") : t("badges.snapshot")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedNetWorth ?? "$0"}</strong>
              <span>{t("metrics.netWorth")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalAssets ?? "$0"}</strong>
              <span>{t("metrics.totalAssets")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalLiabilities ?? "$0"}</strong>
              <span>{t("metrics.totalLiabilities")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.debtToAssetRatioPercent.toFixed(1)}%` : "0.0%"}</strong>
              <span>{t("metrics.debtRatio")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>
                {result ? t("callout.debtRatio", { ratio: result.debtToAssetRatioPercent.toFixed(1) }) : t("callout.waitingTitle")}
              </strong>
              <small>{result?.message ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {netWorthNotes.map((item, index) => (
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
