"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateDividendReinvestment,
  defaultDividendReinvestmentScenario,
  type DividendReinvestmentInput,
  type DividendReinvestmentResult
} from "@/lib/tools/dividend-reinvestment";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "estimate", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const dividendNotes = ["compound", "comparison", "variance"] as const;

export function DividendReinvestmentWorkspace() {
  const t = useTranslations("tools.dividend-reinvestment.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(() => defaultDividendReinvestmentScenario);
  const [result, setResult] = useState(null as DividendReinvestmentResult | null);

  const calculate = () => {
    setResult(calculateDividendReinvestment(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.dividend-reinvestment.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof DividendReinvestmentInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="dividend-reinvestment">
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
          <a className="button button-outline" href={localizedHref("/tools/dividend-reinvestment/about")}>
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
            <label className="field-label" htmlFor="drip-initial">
              {t("fields.initialInvestment")}
              <input className="input" id="drip-initial" min={0} onChange={(event) => updateNumber("initialInvestment", event.target.value)} type="number" value={plan.initialInvestment} />
            </label>
            <label className="field-label" htmlFor="drip-yield">
              {t("fields.dividendYield")}
              <input className="input" id="drip-yield" min={0} onChange={(event) => updateNumber("dividendYield", event.target.value)} step="0.1" type="number" value={plan.dividendYield} />
            </label>
            <label className="field-label" htmlFor="drip-growth">
              {t("fields.stockGrowthRate")}
              <input className="input" id="drip-growth" onChange={(event) => updateNumber("stockGrowthRate", event.target.value)} step="0.1" type="number" value={plan.stockGrowthRate} />
            </label>
            <label className="field-label" htmlFor="drip-years">
              {t("fields.holdingYears")}
              <input className="input" id="drip-years" min={1} onChange={(event) => updateNumber("holdingYears", event.target.value)} type="number" value={plan.holdingYears} />
            </label>
            <label className="field-label" htmlFor="drip-frequency">
              {t("fields.reinvestmentFrequency")}
              <input className="input" id="drip-frequency" min={1} onChange={(event) => updateNumber("reinvestmentFrequency", event.target.value)} type="number" value={plan.reinvestmentFrequency} />
            </label>
            <label className="field-label" htmlFor="drip-tax">
              {t("fields.taxRate")}
              <input className="input" id="drip-tax" min={0} max={100} onChange={(event) => updateNumber("taxRate", event.target.value)} step="0.1" type="number" value={plan.taxRate} />
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
            <span className="badge local">{result ? t("badges.projection") : t("badges.drip")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFinalValue ?? "$0"}</strong>
              <span>{t("metrics.finalValue")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTotalDividends ?? "$0"}</strong>
              <span>{t("metrics.totalDividends")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReinvestmentAdvantage ?? "$0"}</strong>
              <span>{t("metrics.reinvestmentAdvantage")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNoReinvestValue ?? "$0"}</strong>
              <span>{t("metrics.noReinvestValue")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.periods", { periods: result.periods }) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.resultDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {dividendNotes.map((item, index) => (
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
