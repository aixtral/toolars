"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateHomaIr,
  defaultHomaIrScenario,
  type FastingGlucoseUnit,
  type FastingInsulinUnit,
  type HomaIrInput,
  type HomaIrResult
} from "@/lib/tools/homa-ir";

const storageKey = "toolars.homa-ir.labs:v1";
const initialResult: HomaIrResult | null = null;

const trustRows = [
  { key: "local", tone: "local" },
  { key: "lab", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const homaNotes = ["formula", "bands", "screening"] as const;
const glucoseUnitOptions: ReadonlyArray<{ value: FastingGlucoseUnit; label: string }> = [
  { value: "mmoll", label: "mmol/L" },
  { value: "mgdl", label: "mg/dL" }
];
const insulinUnitOptions: ReadonlyArray<{ value: FastingInsulinUnit; label: string }> = [
  { value: "uUml", label: "uU/mL" },
  { value: "pmoll", label: "pmol/L" }
];
const emptyMetricValues = {
  homaIr: "0.00",
  glucose: "0.0 mmol/L",
  insulin: "0.0 uU/mL"
} as const;

function localizedWorkspaceHref(href: string, localeCode: LocaleCode) {
  return localizePath(href, localeCode);
}

function homaLevelKey(homaIr: number) {
  if (homaIr < 2) return "normal";
  if (homaIr <= 2.5) return "borderline";
  return "resistance";
}

export function HomaIrWorkspace() {
  const t = useTranslations("tools.homa-ir.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [values, setValues] = useState(defaultHomaIrScenario);
  const [result, setResult] = useState(initialResult);
  const resultLevelKey = result ? homaLevelKey(result.homaIr) : null;
  const resultLevelLabel = resultLevelKey ? t(`levels.${resultLevelKey}.label`) : t("badges.reference");

  const calculate = () => {
    setResult(calculateHomaIr(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<HomaIrInput, "fastingGlucose" | "fastingInsulin">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="homa-ir">
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
          <a className="button button-outline" href={localizedWorkspaceHref("/tools/homa-ir/about", localeCode)}>
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
            <label className="field-label" htmlFor="homa-glucose">
              {t("fields.fastingGlucose")}
              <input className="input" id="homa-glucose" min={0} onChange={(event) => updateNumber("fastingGlucose", event.target.value)} step="0.1" type="number" value={values.fastingGlucose} />
            </label>
            <label className="field-label" htmlFor="homa-glucose-unit">
              {t("fields.glucoseUnit")}
              <select className="input" id="homa-glucose-unit" onChange={(event) => setValues((current) => ({ ...current, fastingGlucoseUnit: event.target.value as FastingGlucoseUnit }))} value={values.fastingGlucoseUnit}>
                {glucoseUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="homa-insulin">
              {t("fields.fastingInsulin")}
              <input className="input" id="homa-insulin" min={0} onChange={(event) => updateNumber("fastingInsulin", event.target.value)} step="0.1" type="number" value={values.fastingInsulin} />
            </label>
            <label className="field-label" htmlFor="homa-insulin-unit">
              {t("fields.insulinUnit")}
              <select className="input" id="homa-insulin-unit" onChange={(event) => setValues((current) => ({ ...current, fastingInsulinUnit: event.target.value as FastingInsulinUnit }))} value={values.fastingInsulinUnit}>
                {insulinUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
              <p className="tool-description">{result ? t("resultSection.summary", { homaIr: result.formattedHomaIr, level: resultLevelLabel }) : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{resultLevelLabel}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedHomaIr ?? emptyMetricValues.homaIr}</strong>
              <span>{t("metrics.homaIr")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? resultLevelLabel : t("metrics.pending")}</strong>
              <span>{t("metrics.range")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGlucose ?? emptyMetricValues.glucose}</strong>
              <span>{t("metrics.glucose")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedInsulin ?? emptyMetricValues.insulin}</strong>
              <span>{t("metrics.insulin")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? resultLevelLabel : t("callout.waitingTitle")}</strong>
              <small>{resultLevelKey ? t(`levels.${resultLevelKey}.interpretation`) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {homaNotes.map((item, index) => (
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
