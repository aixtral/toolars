"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateIdealWeight,
  defaultIdealWeightScenario,
  type IdealWeightInput,
  type IdealWeightResult,
  type IdealWeightSex
} from "@/lib/tools/ideal-weight-calculator";

const storageKey = "toolars.ideal-weight-calculator.profile:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const bodyNotes = [
  "menFormula",
  "womenFormula",
  "range"
] as const;

export function IdealWeightCalculatorWorkspace() {
  const t = useTranslations("tools.ideal-weight-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const [profile, setProfile] = useState(defaultIdealWeightScenario);
  const [result, setResult] = useState(null as IdealWeightResult | null);

  const calculate = () => {
    setResult(calculateIdealWeight(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {}
  };

  const updateProfile = <Key extends keyof IdealWeightInput>(key: Key, value: IdealWeightInput[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="ideal-weight-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/ideal-weight-calculator/about")}>
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
            <label className="field-label" htmlFor="ideal-weight-sex">
              {t("fields.sex")}
              <select className="input" id="ideal-weight-sex" onChange={(event) => updateProfile("sex", event.target.value as IdealWeightSex)} value={profile.sex}>
                <option value="male">{t("sexOptions.male")}</option>
                <option value="female">{t("sexOptions.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="ideal-weight-height">
              {t("fields.height")}
              <input className="input" id="ideal-weight-height" min={0} onChange={(event) => updateProfile("heightCm", Number(event.target.value))} type="number" value={profile.heightCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
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
                      height: Math.round(Math.max(0, profile.heightCm)),
                      sex: t(`sexOptions.${profile.sex}`)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.devine")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedIdealWeight ?? "0.0 kg"}</strong>
              <span>{t("metrics.idealWeight")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMinimumWeight ?? "0.0 kg"}</strong>
              <span>{t("metrics.rangeLow")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMaximumWeight ?? "0.0 kg"}</strong>
              <span>{t("metrics.rangeHigh")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("resultSection.formulaLabel") : "--"}</strong>
              <span>{t("metrics.formula")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Target size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.result") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {bodyNotes.map((item, index) => (
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
