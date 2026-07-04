"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, MapPin, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCityCostComparison,
  defaultCityCostComparisonScenario,
  type CityCostComparisonInput,
  type CityCostComparisonResult,
  type CityCostInputs
} from "@/lib/tools/city-cost-comparison";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "scenario", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const relocationNotes = ["tax", "costs", "quality"] as const;

export function CityCostComparisonWorkspace() {
  const t = useTranslations("tools.city-cost-comparison.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/city-cost-comparison/about", localeCode);
  const [plan, setPlan] = useState(defaultCityCostComparisonScenario as CityCostComparisonInput);
  const [result, setResult] = useState(null as CityCostComparisonResult | null);

  const calculate = () => {
    setResult(calculateCityCostComparison(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.city-cost-comparison.plan", JSON.stringify(plan));
  };

  const updateIncome = (value: string) => {
    setPlan((current) => ({ ...current, monthlyIncome: Number(value) }));
    setResult(null);
  };

  const updateCity = (city: "cityA" | "cityB", key: keyof CityCostInputs, value: string) => {
    setPlan((current) => ({
      ...current,
      [city]: {
        ...current[city],
        [key]: Number(value)
      }
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="city-cost-comparison">
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
            <label className="field-label" htmlFor="city-income">
              {t("fields.monthlyIncome")}
              <input className="input" id="city-income" min={0} onChange={(event) => updateIncome(event.target.value)} step="100" type="number" value={plan.monthlyIncome} />
            </label>
            <label className="field-label" htmlFor="city-a-rent">
              {t("fields.cityARent")}
              <input className="input" id="city-a-rent" min={0} onChange={(event) => updateCity("cityA", "rent", event.target.value)} step="100" type="number" value={plan.cityA.rent} />
            </label>
            <label className="field-label" htmlFor="city-a-food">
              {t("fields.cityAFood")}
              <input className="input" id="city-a-food" min={0} onChange={(event) => updateCity("cityA", "food", event.target.value)} step="50" type="number" value={plan.cityA.food} />
            </label>
            <label className="field-label" htmlFor="city-a-transport">
              {t("fields.cityATransport")}
              <input className="input" id="city-a-transport" min={0} onChange={(event) => updateCity("cityA", "transport", event.target.value)} step="50" type="number" value={plan.cityA.transport} />
            </label>
            <label className="field-label" htmlFor="city-a-other">
              {t("fields.cityAOther")}
              <input className="input" id="city-a-other" min={0} onChange={(event) => updateCity("cityA", "other", event.target.value)} step="50" type="number" value={plan.cityA.other} />
            </label>
            <label className="field-label" htmlFor="city-b-rent">
              {t("fields.cityBRent")}
              <input className="input" id="city-b-rent" min={0} onChange={(event) => updateCity("cityB", "rent", event.target.value)} step="100" type="number" value={plan.cityB.rent} />
            </label>
            <label className="field-label" htmlFor="city-b-food">
              {t("fields.cityBFood")}
              <input className="input" id="city-b-food" min={0} onChange={(event) => updateCity("cityB", "food", event.target.value)} step="50" type="number" value={plan.cityB.food} />
            </label>
            <label className="field-label" htmlFor="city-b-transport">
              {t("fields.cityBTransport")}
              <input className="input" id="city-b-transport" min={0} onChange={(event) => updateCity("cityB", "transport", event.target.value)} step="50" type="number" value={plan.cityB.transport} />
            </label>
            <label className="field-label" htmlFor="city-b-other">
              {t("fields.cityBOther")}
              <input className="input" id="city-b-other" min={0} onChange={(event) => updateCity("cityB", "other", event.target.value)} step="50" type="number" value={plan.cityB.other} />
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
            <span className={`badge ${result?.winner === "tie" ? "" : "local"}`}>{result?.winner ?? t("badges.compare")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedCityASurplus ?? "$0"}</strong>
              <span>{t("metrics.cityASurplus")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCityBSurplus ?? "$0"}</strong>
              <span>{t("metrics.cityBSurplus")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAnnualDifference ?? "$0"}</strong>
              <span>{t("metrics.annualDifference")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedNetMonthlyIncome ?? "$0"}</strong>
              <span>{t("metrics.netMonthlyIncome")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <MapPin size={18} aria-hidden="true" />
            <span>
              <strong>{result?.winnerTitle ?? t("callout.waitingTitle")}</strong>
              <small>{result?.winnerText ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {relocationNotes.map((item, index) => (
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
