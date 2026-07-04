"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateBmr, defaultBmrScenario, type BmrInput, type BmrResult, type BmrSex } from "@/lib/tools/bmr-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "formula", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const formulaNotes = [
  "resting",
  "tdee",
  "medical"
] as const;

export function BmrCalculatorWorkspace() {
  const t = useTranslations("tools.bmr-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [profile, setProfile] = useState(defaultBmrScenario);
  const [result, setResult] = useState(null as BmrResult | null);

  const calculate = () => {
    setResult(calculateBmr(profile));
  };

  const saveAssumptions = () => {
    window.localStorage.setItem("toolars.bmr-calculator.assumptions", JSON.stringify(profile));
  };

  const updateNumber = (key: keyof Pick<BmrInput, "age" | "heightCm" | "weightKg">, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateSex = (value: BmrSex) => {
    setProfile((current) => ({
      ...current,
      sex: value
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bmr-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/bmr-calculator/about")}>
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
            <label className="field-label" htmlFor="bmr-sex">
              {t("fields.sex")}
              <select className="input" id="bmr-sex" onChange={(event) => updateSex(event.target.value as BmrSex)} value={profile.sex}>
                <option value="male">{t("sexOptions.male")}</option>
                <option value="female">{t("sexOptions.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="bmr-age">
              {t("fields.age")}
              <input className="input" id="bmr-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={profile.age} />
            </label>
            <label className="field-label" htmlFor="bmr-height">
              {t("fields.height")}
              <input className="input" id="bmr-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={profile.heightCm} />
            </label>
            <label className="field-label" htmlFor="bmr-weight">
              {t("fields.weight")}
              <input className="input" id="bmr-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={profile.weightKg} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveAssumptions} type="button">
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
                      sex: t(`sexOptions.${profile.sex}`),
                      age: Math.round(profile.age),
                      height: Math.round(profile.heightCm),
                      weight: Math.round(profile.weightKg)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result?.formulaLabel ?? t("badges.formula")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBmr ?? "0 kcal"}</strong>
              <span>{t("metrics.bmr")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("resultSection.maintainValue", { value: result.formattedMaintainTarget }) : "0 kcal"}</strong>
              <span>{t("metrics.maintain")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLossTarget ?? "0 kcal"}</strong>
              <span>{t("metrics.lossTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGainTarget ?? "0 kcal"}</strong>
              <span>{t("metrics.gainTarget")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.result") : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.baselineDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {formulaNotes.map((item, index) => (
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
