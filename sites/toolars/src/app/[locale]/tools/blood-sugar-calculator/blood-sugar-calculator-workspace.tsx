"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Droplet, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateBloodSugar,
  defaultBloodSugarScenario,
  type BloodSugarInput,
  type BloodSugarInputMode,
  type BloodSugarResult,
  type GlucoseUnit
} from "@/lib/tools/blood-sugar-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const sugarNotes = ["formula", "interpretation", "care"] as const;

export function BloodSugarCalculatorWorkspace() {
  const t = useTranslations("tools.blood-sugar-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(defaultBloodSugarScenario as BloodSugarInput);
  const [result, setResult] = useState(null as BloodSugarResult | null);

  const calculate = () => {
    setResult(calculateBloodSugar(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem("toolars.blood-sugar-calculator.values", JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<BloodSugarInput, "fastingGlucose" | "a1c" | "averageGlucose">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: BloodSugarInputMode) => {
    setValues((current) => ({ ...current, inputMode: value }));
    setResult(null);
  };

  const updateUnit = (key: "fastingGlucoseUnit" | "averageGlucoseUnit", value: GlucoseUnit) => {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="blood-sugar-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/blood-sugar-calculator/about")}>
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
            <label className="field-label" htmlFor="blood-sugar-mode">
              {t("fields.inputMode")}
              <select className="input" id="blood-sugar-mode" onChange={(event) => updateMode(event.target.value as BloodSugarInputMode)} value={values.inputMode}>
                <option value="fpg">{t("options.inputMode.fpg")}</option>
                <option value="a1c">{t("options.inputMode.a1c")}</option>
                <option value="eag">{t("options.inputMode.eag")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="blood-sugar-fpg">
              {t("fields.fastingGlucose")}
              <input className="input" id="blood-sugar-fpg" min={0} onChange={(event) => updateNumber("fastingGlucose", event.target.value)} step="0.1" type="number" value={values.fastingGlucose} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-fpg-unit">
              {t("fields.fpgUnit")}
              <select className="input" id="blood-sugar-fpg-unit" onChange={(event) => updateUnit("fastingGlucoseUnit", event.target.value as GlucoseUnit)} value={values.fastingGlucoseUnit}>
                <option value="mmoll">{t("options.units.mmoll")}</option>
                <option value="mgdl">{t("options.units.mgdl")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="blood-sugar-a1c">
              {t("fields.a1c")}
              <input className="input" id="blood-sugar-a1c" min={0} onChange={(event) => updateNumber("a1c", event.target.value)} step="0.1" type="number" value={values.a1c} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-eag">
              {t("fields.averageGlucose")}
              <input className="input" id="blood-sugar-eag" min={0} onChange={(event) => updateNumber("averageGlucose", event.target.value)} step="1" type="number" value={values.averageGlucose} />
            </label>
            <label className="field-label" htmlFor="blood-sugar-eag-unit">
              {t("fields.eagUnit")}
              <select className="input" id="blood-sugar-eag-unit" onChange={(event) => updateUnit("averageGlucoseUnit", event.target.value as GlucoseUnit)} value={values.averageGlucoseUnit}>
                <option value="mgdl">{t("options.units.mgdl")}</option>
                <option value="mmoll">{t("options.units.mmoll")}</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
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
            <span className="badge warn">{t("badges.referenceOnly")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFastingGlucose ?? t("metrics.emptyFastingGlucose")}</strong>
              <span>{t("metrics.fastingGlucose")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedA1c ?? t("metrics.emptyA1c")}</strong>
              <span>{t("metrics.a1c")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverageGlucose ?? t("metrics.emptyAverageGlucose")}</strong>
              <span>{t("metrics.averageGlucose")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.riskBand ?? t("metrics.emptyRiskBand")}</strong>
              <span>{t("metrics.riskBand")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplet size={18} aria-hidden="true" />
            <span>
              <strong>{result?.advice ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {sugarNotes.map((item, index) => (
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
