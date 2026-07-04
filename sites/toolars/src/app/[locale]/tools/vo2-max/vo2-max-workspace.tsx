"use client";
import { useLocale, useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateVo2Max,
  defaultVo2MaxScenario,
  vo2MethodOptions,
  type Vo2MaxInput,
  type Vo2MaxResult,
  type Vo2Method,
  type Vo2Sex
} from "@/lib/tools/vo2-max";

const storageKey = "toolars.vo2-max.test:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "training", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const trainingNotes = ["cooperFormula", "femaleMultiplier", "restingHrFormula"] as const;

export function Vo2MaxWorkspace() {
  const t = useTranslations("tools.vo2-max.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/vo2-max/about", localeCode);
  const [test, setTest] = useState((): Vo2MaxInput => ({ ...defaultVo2MaxScenario }));
  const [result, setResult] = useState(null as Vo2MaxResult | null);

  const calculate = () => {
    setResult(calculateVo2Max(test));
  };

  const saveTest = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(test));
    } catch {}
  };

  const updateTest = <Key extends keyof Vo2MaxInput>(key: Key, value: Vo2MaxInput[Key]) => {
    setTest((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="vo2-max">
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
            <label className="field-label" htmlFor="vo2-method">
              {t("fields.method")}
              <select className="input" id="vo2-method" onChange={(event) => updateTest("method", event.target.value as Vo2Method)} value={test.method}>
                {vo2MethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`options.method.${option.value}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="vo2-distance">
              {t("fields.distanceMeters")}
              <input className="input" id="vo2-distance" min={0} onChange={(event) => updateTest("distanceMeters", Number(event.target.value))} type="number" value={test.distanceMeters} />
            </label>
            <label className="field-label" htmlFor="vo2-sex">
              {t("fields.sex")}
              <select className="input" id="vo2-sex" onChange={(event) => updateTest("sex", event.target.value as Vo2Sex)} value={test.sex}>
                <option value="male">{t("options.sex.male")}</option>
                <option value="female">{t("options.sex.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="vo2-age">
              {t("fields.age")}
              <input className="input" id="vo2-age" min={0} onChange={(event) => updateTest("age", Number(event.target.value))} type="number" value={test.age} />
            </label>
            <label className="field-label" htmlFor="vo2-resting-hr">
              {t("fields.restingHeartRate")}
              <input className="input" id="vo2-resting-hr" min={1} onChange={(event) => updateTest("restingHeartRate", Number(event.target.value))} type="number" value={test.restingHeartRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveTest} type="button">
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
            <span className="badge warn">{result?.methodLabel ?? t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedVo2Max ?? t("metrics.emptyVo2Max")}</strong>
              <span>{t("metrics.vo2Unit")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.fitnessLevel ?? t("metrics.pending")}</strong>
              <span>{t("metrics.fitnessLevel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? (test.method === "cooper" ? t("metrics.methodCooper") : t("metrics.methodRestingHeartRate")) : t("metrics.pending")}</strong>
              <span>{t("metrics.method")}</span>
            </article>
            <article className="llm-metric">
              <strong>
                {test.method === "cooper"
                  ? t("metrics.sourceDistance", { distanceMeters: test.distanceMeters })
                  : t("metrics.sourceRestingHeartRate", { restingHeartRate: test.restingHeartRate })}
              </strong>
              <span>{t("metrics.sourceInput")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.referenceRows ?? []).map((row) => (
              <div className="profile-row" key={row.label}>
                <span className="badge">{row.label}</span>
                <span>{row.range}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {trainingNotes.map((item, index) => (
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
