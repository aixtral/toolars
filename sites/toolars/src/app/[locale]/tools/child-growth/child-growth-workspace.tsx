"use client";
import { useLocale, useTranslations } from "next-intl";

import { Baby, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateChildGrowth, defaultChildGrowthProfile, type ChildGrowthInput, type ChildGrowthResult, type ChildGrowthSex } from "@/lib/tools/child-growth";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const growthNotes = ["bmi", "trend", "context"] as const;

export function ChildGrowthWorkspace() {
  const t = useTranslations("tools.child-growth.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/child-growth/about", localeCode);
  const [profile, setProfile] = useState(defaultChildGrowthProfile as ChildGrowthInput);
  const [result, setResult] = useState(null as ChildGrowthResult | null);

  const calculate = () => {
    setResult(calculateChildGrowth(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem("toolars.child-growth.profile", JSON.stringify(profile));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<ChildGrowthInput, "ageYears" | "ageMonths" | "heightCm" | "weightKg">, value: string) => {
    setProfile((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: ChildGrowthSex) => {
    setProfile((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="child-growth">
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
            <label className="field-label" htmlFor="growth-sex">
              {t("fields.sex")}
              <select className="input" id="growth-sex" onChange={(event) => updateSex(event.target.value as ChildGrowthSex)} value={profile.sex}>
                <option value="boy">{t("options.sex.boy")}</option>
                <option value="girl">{t("options.sex.girl")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="growth-age-years">
              {t("fields.ageYears")}
              <input className="input" id="growth-age-years" min={2} onChange={(event) => updateNumber("ageYears", event.target.value)} type="number" value={profile.ageYears} />
            </label>
            <label className="field-label" htmlFor="growth-age-months">
              {t("fields.ageMonths")}
              <select className="input" id="growth-age-months" onChange={(event) => updateNumber("ageMonths", event.target.value)} value={profile.ageMonths}>
                <option value={0}>{t("options.ageMonths.zero")}</option>
                <option value={3}>{t("options.ageMonths.three")}</option>
                <option value={6}>{t("options.ageMonths.six")}</option>
                <option value={9}>{t("options.ageMonths.nine")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="growth-height">
              {t("fields.heightCm")}
              <input className="input" id="growth-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={profile.heightCm} />
            </label>
            <label className="field-label" htmlFor="growth-weight">
              {t("fields.weightKg")}
              <input className="input" id="growth-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={profile.weightKg} />
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
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.referenceOnly")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedPercentile ?? t("metrics.emptyPercentile")}</strong>
              <span>{t("metrics.bmiPercentile")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBmi ?? t("metrics.emptyBmi")}</strong>
              <span>{t("metrics.bmi")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.category ?? t("metrics.emptyCategory")}</strong>
              <span>{t("metrics.category")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.idealWeightRange ?? t("metrics.emptyWeightRange")}</strong>
              <span>{t("metrics.referenceWeightRange")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Baby size={18} aria-hidden="true" />
            <span>
              <strong>{result?.rankLabel ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription", { ageLabel: result.ageLabel }) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {growthNotes.map((item, index) => (
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
