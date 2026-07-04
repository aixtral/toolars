"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, TestTube2 } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateTestosterone,
  defaultTestosteroneScenario,
  type TestosteroneAlbuminUnit,
  type TestosteroneInput,
  type TestosteroneResult,
  type TestosteroneSex,
  type TestosteroneShbgUnit,
  type TestosteroneTotalUnit
} from "@/lib/tools/testosterone-calculator";

const storageKey = "toolars.testosterone-calculator.lab:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "medical", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const clinicalNotes = ["conversion", "estimate", "diagnosis"] as const;
const totalUnitOptions = [
  { value: "ngdl", key: "ngdl" },
  { value: "nmoll", key: "nmoll" }
] as const;
const shbgUnitOptions = [
  { value: "nmoll", key: "nmoll" },
  { value: "ngdl", key: "ngdl" }
] as const;
const albuminUnitOptions = [
  { value: "gdl", key: "gdl" },
  { value: "gl", key: "gl" }
] as const;
const sexOptions = [
  { value: "male", key: "male" },
  { value: "female", key: "female" }
] as const;

export function TestosteroneCalculatorWorkspace() {
  const t = useTranslations("tools.testosterone-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/testosterone-calculator/about", localeCode);
  const [lab, setLab] = useState(defaultTestosteroneScenario);
  const [result, setResult] = useState<TestosteroneResult | null>(null);
  const statusKey = result?.status.toLowerCase() as "low" | "normal" | "high" | undefined;

  const calculate = () => {
    setResult(calculateTestosterone(lab));
  };

  const saveLab = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lab));
    } catch {}
  };

  const updateLab = <Key extends keyof TestosteroneInput>(key: Key, value: TestosteroneInput[Key]) => {
    setLab((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="testosterone-calculator">
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
            <label className="field-label" htmlFor="testosterone-total">
              {t("fields.totalTestosterone")}
              <input className="input" id="testosterone-total" min={0} onChange={(event) => updateLab("totalTestosterone", Number(event.target.value))} step="0.1" type="number" value={lab.totalTestosterone} />
            </label>
            <label className="field-label" htmlFor="testosterone-total-unit">
              {t("fields.totalUnit")}
              <select className="input" id="testosterone-total-unit" onChange={(event) => updateLab("totalUnit", event.target.value as TestosteroneTotalUnit)} value={lab.totalUnit}>
                {totalUnitOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.totalUnit.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-shbg">
              {t("fields.shbg")}
              <input className="input" id="testosterone-shbg" min={0} onChange={(event) => updateLab("shbg", Number(event.target.value))} step="0.1" type="number" value={lab.shbg} />
            </label>
            <label className="field-label" htmlFor="testosterone-shbg-unit">
              {t("fields.shbgUnit")}
              <select className="input" id="testosterone-shbg-unit" onChange={(event) => updateLab("shbgUnit", event.target.value as TestosteroneShbgUnit)} value={lab.shbgUnit}>
                {shbgUnitOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.shbgUnit.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-albumin">
              {t("fields.albumin")}
              <input className="input" id="testosterone-albumin" min={0} onChange={(event) => updateLab("albumin", Number(event.target.value))} step="0.1" type="number" value={lab.albumin} />
            </label>
            <label className="field-label" htmlFor="testosterone-albumin-unit">
              {t("fields.albuminUnit")}
              <select className="input" id="testosterone-albumin-unit" onChange={(event) => updateLab("albuminUnit", event.target.value as TestosteroneAlbuminUnit)} value={lab.albuminUnit}>
                {albuminUnitOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.albuminUnit.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="testosterone-sex">
              {t("fields.sex")}
              <select className="input" id="testosterone-sex" onChange={(event) => updateLab("sex", event.target.value as TestosteroneSex)} value={lab.sex}>
                {sexOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.sex.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveLab} type="button">
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
                  ? t("resultSection.calculatedDescription", { totalTestosterone: result.totalTestosteroneNgDl.toFixed(1), shbg: result.shbgNmolL.toFixed(1) })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.referenceOnly")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFreeTestosterone ?? t("metrics.emptyFreeTestosterone")}</strong>
              <span>{t("metrics.freeTestosterone")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBioavailableTestosterone ?? t("metrics.emptyBioavailableTestosterone")}</strong>
              <span>{t("metrics.bioavailableTestosterone")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFreePercent ?? t("metrics.emptyFreePercent")}</strong>
              <span>{t("metrics.freePercent")}</span>
            </article>
            <article className="llm-metric">
              <strong>{statusKey ? t(`statuses.${statusKey}`) : t("metrics.emptyStatus")}</strong>
              <span>{t("metrics.referenceStatus")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <TestTube2 size={18} aria-hidden="true" />
            <span>
              <strong>{statusKey ? t(`recommendations.${lab.sex}.${statusKey}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription", { referenceRange: result.referenceRange }) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {clinicalNotes.map((item, index) => (
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
