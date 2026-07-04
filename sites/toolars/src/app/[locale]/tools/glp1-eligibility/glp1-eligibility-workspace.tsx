"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateGlp1Eligibility,
  defaultGlp1EligibilityScenario,
  type Glp1Comorbidity,
  type Glp1EligibilityInput,
  type Glp1EligibilityResult
} from "@/lib/tools/glp1-eligibility";

const storageKey = "toolars.glp1-eligibility.snapshot:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "medical", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const prescriptionNotes = [
  "criteria",
  "clinician",
  "coverage"
] as const;

const comorbidityKeys: Glp1Comorbidity[] = [
  "diabetes",
  "hypertension",
  "cholesterol",
  "sleepApnea",
  "pcos",
  "heart"
];

function getBmiCategoryKey(bmi: number) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesity";
}

function getCriteriaStatusKey(result: Glp1EligibilityResult) {
  if (result.isCriteriaMatch) return "match";
  if (result.bmi >= 27) return "needsComorbidity";
  return "notMet";
}

function getMedicationNoteKey(result: Glp1EligibilityResult) {
  if (result.isCriteriaMatch) return "match";
  if (result.bmi >= 27) return "review";
  return "notMet";
}

export function Glp1EligibilityWorkspace() {
  const t = useTranslations("tools.glp1-eligibility.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(defaultGlp1EligibilityScenario);
  const [result, setResult] = useState(null as Glp1EligibilityResult | null);
  const resultCriteriaKey = result ? getCriteriaStatusKey(result) : null;
  const resultCriteriaStatus = resultCriteriaKey ? t(`criteriaStatuses.${resultCriteriaKey}`) : null;

  const calculate = () => {
    setResult(calculateGlp1Eligibility(values));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<Glp1EligibilityInput, "heightCm" | "weightKg">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const toggleComorbidity = (comorbidity: Glp1Comorbidity) => {
    setValues((current) => ({
      ...current,
      comorbidities: current.comorbidities.includes(comorbidity) ? current.comorbidities.filter((item) => item !== comorbidity) : [...current.comorbidities, comorbidity]
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="glp1-eligibility">
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
          <a className="button button-outline" href={localizedHref("/tools/glp1-eligibility/about")}>
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
            <label className="field-label" htmlFor="glp1-eligibility-height">
              {t("fields.height")}
              <input className="input" id="glp1-eligibility-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={values.heightCm} />
            </label>
            <label className="field-label" htmlFor="glp1-eligibility-weight">
              {t("fields.weight")}
              <input className="input" id="glp1-eligibility-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {comorbidityKeys.map((key) => (
              <label className="profile-row" key={key} htmlFor={`glp1-${key}`}>
                <input checked={values.comorbidities.includes(key)} id={`glp1-${key}`} onChange={() => toggleComorbidity(key)} type="checkbox" />
                <span>{t(`comorbidities.${key}`)}</span>
              </label>
            ))}
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
              <p className="tool-description">
                {result && resultCriteriaStatus
                  ? t("resultSection.summary", { bmi: result.formattedBmi, criteria: resultCriteriaStatus })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.medicalReview")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? "0.0"}</strong>
              <span>{t("metrics.bmi")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`bmiCategories.${getBmiCategoryKey(result.bmi)}`) : "--"}</strong>
              <span>{t("metrics.bmiCategory")}</span>
            </article>
            <article className="llm-metric">
              <strong>{resultCriteriaStatus ?? "--"}</strong>
              <span>{t("metrics.criteria")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.hasComorbidity ? t("formats.comorbiditySelected", { count: values.comorbidities.length }) : t("metrics.noneSelected")}</strong>
              <span>{t("metrics.comorbidityContext")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Scale size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`medicationNotes.${getMedicationNoteKey(result)}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.reviewDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {prescriptionNotes.map((item, index) => (
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
