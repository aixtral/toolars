"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Ruler, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateBodyFat, defaultBodyFatScenario, type BodyFatInput, type BodyFatResult, type BodyFatSex } from "@/lib/tools/body-fat-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const measurementNotes = ["consistency", "sexFormula", "variables"] as const;

export function BodyFatCalculatorWorkspace() {
  const t = useTranslations("tools.body-fat-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [measurements, setMeasurements] = useState((): BodyFatInput => ({ ...defaultBodyFatScenario }));
  const [result, setResult] = useState(null as BodyFatResult | null);

  const calculate = () => {
    setResult(calculateBodyFat(measurements));
  };

  const saveMeasurements = () => {
    window.localStorage.setItem("toolars.body-fat-calculator.measurements", JSON.stringify(measurements));
  };

  const updateNumber = (key: keyof Pick<BodyFatInput, "heightCm" | "neckCm" | "waistCm" | "hipCm" | "weightKg">, value: string) => {
    setMeasurements((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateSex = (value: BodyFatSex) => {
    setMeasurements((current) => ({
      ...current,
      sex: value
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="body-fat-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/body-fat-calculator/about")}>
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
            <label className="field-label" htmlFor="body-fat-sex">
              {t("fields.sex")}
              <select className="input" id="body-fat-sex" onChange={(event) => updateSex(event.target.value as BodyFatSex)} value={measurements.sex}>
                <option value="male">{t("fields.male")}</option>
                <option value="female">{t("fields.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="body-fat-weight">
              {t("fields.weightKg")}
              <input className="input" id="body-fat-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={measurements.weightKg} />
            </label>
            <label className="field-label" htmlFor="body-fat-height">
              {t("fields.heightCm")}
              <input className="input" id="body-fat-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={measurements.heightCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-neck">
              {t("fields.neckCm")}
              <input className="input" id="body-fat-neck" min={0} onChange={(event) => updateNumber("neckCm", event.target.value)} type="number" value={measurements.neckCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-waist">
              {t("fields.waistCm")}
              <input className="input" id="body-fat-waist" min={0} onChange={(event) => updateNumber("waistCm", event.target.value)} type="number" value={measurements.waistCm} />
            </label>
            <label className="field-label" htmlFor="body-fat-hip">
              {t("fields.hipCm")}
              <input className="input" id="body-fat-hip" min={0} onChange={(event) => updateNumber("hipCm", event.target.value)} type="number" value={measurements.hipCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveMeasurements} type="button">
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
            <span className="badge warn">{result?.formulaLabel ?? t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBodyFat ?? "0.0%"}</strong>
              <span>{t("metrics.bodyFat")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? t("metrics.pending")}</strong>
              <span>{t("metrics.referenceCategory")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatMass ?? "0.0 kg"}</strong>
              <span>{t("metrics.fatMass")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLeanMass ?? "0.0 kg"}</strong>
              <span>{t("metrics.leanMass")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Ruler size={18} aria-hidden="true" />
            <span>
              <strong>{result?.tip ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.trendDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {measurementNotes.map((item, index) => (
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
