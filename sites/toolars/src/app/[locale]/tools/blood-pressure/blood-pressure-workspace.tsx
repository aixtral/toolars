"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateBloodPressure, defaultBloodPressureReading, type BloodPressureInput, type BloodPressureResult } from "@/lib/tools/blood-pressure";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const bpNotes = [
  "thresholds",
  "variation",
  "medicalAttention"
] as const;

export function BloodPressureWorkspace() {
  const t = useTranslations("tools.blood-pressure.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [reading, setReading] = useState(() => defaultBloodPressureReading);
  const [result, setResult] = useState(null as BloodPressureResult | null);

  const calculate = () => {
    setResult(calculateBloodPressure(reading));
  };

  const saveReading = () => {
    try {
      window.localStorage.setItem("toolars.blood-pressure.reading", JSON.stringify(reading));
    } catch {}
  };

  const updateNumber = (key: keyof BloodPressureInput, value: string) => {
    setReading((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="blood-pressure">
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
          <a className="button button-outline" href={localizedHref("/tools/blood-pressure/about")}>
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
            <label className="field-label" htmlFor="bp-systolic">
              {t("fields.systolic")}
              <input className="input" id="bp-systolic" min={0} onChange={(event) => updateNumber("systolic", event.target.value)} type="number" value={reading.systolic} />
            </label>
            <label className="field-label" htmlFor="bp-diastolic">
              {t("fields.diastolic")}
              <input className="input" id="bp-diastolic" min={0} onChange={(event) => updateNumber("diastolic", event.target.value)} type="number" value={reading.diastolic} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveReading} type="button">
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
                {result ? t("resultSection.summary", { reading: result.formattedReading }) : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? t(`category.${result.category}.label`) : t("metrics.pending")}</strong>
              <span>{t("metrics.category")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReading ?? "0/0"}</strong>
              <span>{t("metrics.reading")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.systolic}` : "0"}</strong>
              <span>{t("metrics.systolic")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.diastolic}` : "0"}</strong>
              <span>{t("metrics.diastolic")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`category.${result.category}.reason`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t(`category.${result.category}.advice`) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {bpNotes.map((item, index) => (
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
