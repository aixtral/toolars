"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Droplets, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCreatineDose,
  creatineTrainingOptions,
  defaultCreatineScenario,
  type CreatineInput,
  type CreatineResult,
  type CreatineTrainingIntensity,
  type CreatineWeightUnit
} from "@/lib/tools/creatine-calculator";

const storageKey = "toolars.creatine-calculator.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "supplement", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const supplementNotes = ["maintenance", "training", "loading"] as const;

export function CreatineCalculatorWorkspace() {
  const t = useTranslations("tools.creatine-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/creatine-calculator/about", localeCode);
  const [plan, setPlan] = useState(() => defaultCreatineScenario as CreatineInput);
  const [result, setResult] = useState(null as CreatineResult | null);

  const calculate = () => {
    setResult(calculateCreatineDose(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof CreatineInput>(key: Key, value: CreatineInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="creatine-calculator">
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
            <label className="field-label" htmlFor="creatine-weight">
              {t("fields.weight")}
              <input className="input" id="creatine-weight" min={0} onChange={(event) => updatePlan("weight", Number(event.target.value))} type="number" value={plan.weight} />
            </label>
            <label className="field-label" htmlFor="creatine-unit">
              {t("fields.unit")}
              <select className="input" id="creatine-unit" onChange={(event) => updatePlan("unit", event.target.value as CreatineWeightUnit)} value={plan.unit}>
                <option value="kg">{t("fields.kg")}</option>
                <option value="lb">{t("fields.lb")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="creatine-training">
              {t("fields.trainingIntensity")}
              <select className="input" id="creatine-training" onChange={(event) => updatePlan("trainingIntensity", event.target.value as CreatineTrainingIntensity)} value={plan.trainingIntensity}>
                {creatineTrainingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`fields.trainingOptions.${option.value}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            <label className="profile-row" htmlFor="creatine-vegetarian">
              <input checked={plan.vegetarian} id="creatine-vegetarian" onChange={(event) => updatePlan("vegetarian", event.target.checked)} type="checkbox" />
              <span>{t("fields.vegetarian")}</span>
            </label>
            <label className="profile-row" htmlFor="creatine-loading">
              <input checked={plan.loading} id="creatine-loading" onChange={(event) => updatePlan("loading", event.target.checked)} type="checkbox" />
              <span>{t("fields.loading")}</span>
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
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMaintenance ?? "0 g"}</strong>
              <span>{t("metrics.maintenance")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.rangeLabel ?? "3-5 g/day"}</strong>
              <span>{t("metrics.sourceRange")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLoadingDose ?? t("metrics.notEnabled")}</strong>
              <span>{t("metrics.loadingPhase")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedExtraWater ?? "0 ml"}</strong>
              <span>{t("metrics.extraWater")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplets size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>{result ? result.loadingProtocol : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {supplementNotes.map((item, index) => (
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
