"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateFire,
  defaultFireScenario,
  type FireInput,
  type FireResult
} from "@/lib/tools/fire-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "noAdvice", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const fireNotes = [
  "fourPercent",
  "projection",
  "risks"
] as const;

export function FireCalculatorWorkspace() {
  const t = useTranslations("tools.fire-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultFireScenario as FireInput);
  const [result, setResult] = useState(null as FireResult | null);

  const calculate = () => {
    setResult(calculateFire(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.fire-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof FireInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="fire-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/fire-calculator/about")}>
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
            <label className="field-label" htmlFor="fire-expenses">
              {t("fields.annualExpenses")}
              <input className="input" id="fire-expenses" min={0} onChange={(event) => updateNumber("annualExpenses", event.target.value)} step="1000" type="number" value={plan.annualExpenses} />
            </label>
            <label className="field-label" htmlFor="fire-income">
              {t("fields.annualIncome")}
              <input className="input" id="fire-income" min={0} onChange={(event) => updateNumber("annualIncome", event.target.value)} step="1000" type="number" value={plan.annualIncome} />
            </label>
            <label className="field-label" htmlFor="fire-net-worth">
              {t("fields.currentNetWorth")}
              <input className="input" id="fire-net-worth" min={0} onChange={(event) => updateNumber("currentNetWorth", event.target.value)} step="1000" type="number" value={plan.currentNetWorth} />
            </label>
            <label className="field-label" htmlFor="fire-return">
              {t("fields.annualReturn")}
              <input className="input" id="fire-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
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
                      fireNumber: result.formattedFireNumber,
                      savingsRate: result.formattedSavingsRate
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.guidanceTone === "blocked" ? "warn" : "local"}`}>
              {result ? t(`guidanceTones.${result.guidanceTone}`) : t("badges.fire")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFireNumber ?? "$0"}</strong>
              <span>{t("metrics.fireNumber")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSavingsRate ?? "0.0%"}</strong>
              <span>{t("metrics.savingsRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? (result.yearsToFire >= 100 ? t("metrics.yearsToFireMax") : t("metrics.yearsToFireValue", { years: result.yearsToFire })) : t("metrics.yearsToFireEmpty")}</strong>
              <span>{t("metrics.yearsToFire")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualSavings ?? "$0"}</strong>
              <span>{t("metrics.annualSavings")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formattedProjectedBalance ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t(`guidance.${result.guidanceTone}`) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {fireNotes.map((item, index) => (
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
