"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PieChart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateRoi,
  defaultRoiScenario,
  type RoiInput,
  type RoiResult
} from "@/lib/tools/roi-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "context", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const comparisonNotes = [
  "formula",
  "totalReturn",
  "context"
] as const;

export function RoiCalculatorWorkspace() {
  const t = useTranslations("tools.roi-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): RoiInput => defaultRoiScenario);
  const [result, setResult] = useState((): RoiResult | null => null);

  const calculate = () => {
    setResult(calculateRoi(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.roi-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RoiInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="roi-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/roi-calculator/about")}>
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
            <label className="field-label" htmlFor="roi-cost">
              {t("fields.investmentCost")}
              <input className="input" id="roi-cost" min={0} onChange={(event) => updateNumber("investmentCost", event.target.value)} step="1" type="number" value={plan.investmentCost} />
            </label>
            <label className="field-label" htmlFor="roi-value">
              {t("fields.finalValue")}
              <input className="input" id="roi-value" min={0} onChange={(event) => updateNumber("finalValue", event.target.value)} step="1" type="number" value={plan.finalValue} />
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
                      outcome: t(result.resultTone === "loss" ? "outcomes.loss" : "outcomes.profit"),
                      profit: result.formattedProfit,
                      roi: result.formattedRoi
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.resultTone === "loss" ? "warn" : "local"}`}>
              {result ? t(`badges.${result.resultTone}`) : t("badges.roi")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRoi ?? "0.00%"}</strong>
              <span>{t("metrics.roi")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProfit ?? "$0"}</strong>
              <span>{t("metrics.profit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCost ?? "$0"}</strong>
              <span>{t("metrics.cost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFinalValue ?? "$0"}</strong>
              <span>{t("metrics.finalValue")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PieChart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.readyTitle") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.readyDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {comparisonNotes.map((item, index) => (
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
