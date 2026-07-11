"use client";

import { Activity, Calculator, Download, Save, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateBmi,
  defaultBmiProfile,
  type BmiInput,
  type BmiResult
} from "@/lib/tools/bmi-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "" },
  { key: "privacy", tone: "" }
] as const;

const healthNotes = [
  "screening",
  "context",
  "savedOutput"
] as const;

export function BmiCalculatorWorkspace() {
  const t = useTranslations("tools.bmi-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [profile, setProfile] = useState(defaultBmiProfile);
  const [result, setResult] = useState(null as BmiResult | null);

  const calculate = () => {
    setResult(calculateBmi(profile));
  };

  const saveProfile = () => {
    window.localStorage.setItem("toolars.bmi-calculator.profile", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof BmiInput, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bmi-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/bmi-calculator/about")}>
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
            <label className="field-label" htmlFor="bmi-height">
              {t("fields.height")}
              <input
                className="input"
                id="bmi-height"
                min={1}
                onChange={(event) => updateNumber("heightCm", event.target.value)}
                type="number"
                value={profile.heightCm}
              />
            </label>
            <label className="field-label" htmlFor="bmi-weight">
              {t("fields.weight")}
              <input
                className="input"
                id="bmi-weight"
                min={1}
                onChange={(event) => updateNumber("weightKg", event.target.value)}
                type="number"
                value={profile.weightKg}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveProfile}>
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            <button className="button button-solid" type="button" onClick={calculate}>
              <Calculator size={16} aria-hidden="true" /> {t("actions.calculate")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultSection.title")}</h2>
              <p className="tool-description">
                {result ? t("resultSection.summary", { bmi: result.formattedBmi }) : t("resultSection.emptyDescription")}
              </p>
            </div>
            <button disabled className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> {t("actions.export")}
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? "0.0"}</strong>
              <span>{t("metrics.bmi")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`categories.${result.category}.label`) : t("metrics.pending")}</strong>
              <span>{t("metrics.referenceCategory")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.healthyWeightRange ?? t("placeholders.healthyWeightRange")}</strong>
              <span>{t("metrics.healthyWeightRange")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.inputSummary ?? t("placeholders.inputSummary")}</strong>
              <span>{t("metrics.inputSummary")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`categories.${result.category}.recommendation`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {healthNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong><ShieldCheck size={16} aria-hidden="true" /> {t("recommendation.title")}</strong>
          <p>{t("recommendation.body")}</p>
        </div>
      </aside>
    </div>
  );
}
