"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Wheat } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateFiberIntake,
  defaultFiberIntakeScenario,
  fiberFoodReferences,
  type FiberIntakeInput,
  type FiberIntakeResult,
  type FiberSex
} from "@/lib/tools/fiber-intake";

const storageKey = "toolars.fiber-intake.profile:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "gutHealth", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const fiberNotes = ["model", "baseline", "tolerance"] as const;

export function FiberIntakeWorkspace() {
  const t = useTranslations("tools.fiber-intake.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState((): FiberIntakeInput => ({ ...defaultFiberIntakeScenario }));
  const [result, setResult] = useState(null as FiberIntakeResult | null);

  const calculate = () => {
    setResult(calculateFiberIntake(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<FiberIntakeInput, "weightKg" | "age" | "currentFiberGrams">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="fiber-intake">
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
          <a className="button button-outline" href={localizedHref("/tools/fiber-intake/about")}>
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
            <label className="field-label" htmlFor="fiber-weight">
              {t("fields.weight")}
              <input className="input" id="fiber-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="fiber-age">
              {t("fields.age")}
              <input className="input" id="fiber-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} step="1" type="number" value={values.age} />
            </label>
            <label className="field-label" htmlFor="fiber-sex">
              {t("fields.sex")}
              <select className="input" id="fiber-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as FiberSex }))} value={values.sex}>
                <option value="male">{t("sexOptions.male")}</option>
                <option value="female">{t("sexOptions.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="fiber-current">
              {t("fields.currentFiber")}
              <input className="input" id="fiber-current" min={0} onChange={(event) => updateNumber("currentFiberGrams", event.target.value)} step="0.5" type="number" value={values.currentFiberGrams} />
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
              <p className="tool-description">{result ? result.summary : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge local">{result ? `${result.progressPercent}%` : t("badges.target")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRecommendedFiber ?? "0 g"}</strong>
              <span>{t("metrics.dailyTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.recommendedRange ?? "0-0 g/day"}</strong>
              <span>{t("metrics.recommendedRange")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.progressPercent}%` : "0%"}</strong>
              <span>{t("metrics.progress")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGap ?? "0 g"}</strong>
              <span>{t("metrics.gap")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Wheat size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.remaining", { gap: result.formattedGap }) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.gradual") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {fiberNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="profile-list" style={{ marginTop: 18 }}>
          {fiberFoodReferences.map((food) => (
            <div className="profile-row" key={food.label}>
              <span>{food.label}</span>
              <strong>{food.fiberPer100g} g</strong>
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
