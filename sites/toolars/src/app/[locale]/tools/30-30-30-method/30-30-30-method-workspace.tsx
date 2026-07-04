"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, SunMedium } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateThirtyThirtyThirty,
  defaultThirtyThirtyThirtyScenario,
  thirtyActivityReferences,
  type ThirtyActivity,
  type ThirtySex,
  type ThirtyThirtyThirtyInput,
  type ThirtyThirtyThirtyResult
} from "@/lib/tools/30-30-30-method";

const storageKey = "toolars.30-30-30-method.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "nutrition", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const routineNotes = ["target", "met", "medical"] as const;

export function ThirtyThirtyThirtyMethodWorkspace() {
  const t = useTranslations("tools.30-30-30-method.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/30-30-30-method/about", localeCode);
  const [plan, setPlan] = useState(() => defaultThirtyThirtyThirtyScenario as ThirtyThirtyThirtyInput);
  const [result, setResult] = useState(null as ThirtyThirtyThirtyResult | null);

  const calculate = () => {
    setResult(calculateThirtyThirtyThirty(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<ThirtyThirtyThirtyInput, "weightKg" | "age">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="30-30-30-method">
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
            <label className="field-label" htmlFor="thirty-weight">
              {t("fields.weightKg")}
              <input className="input" id="thirty-weight" min={30} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="thirty-age">
              {t("fields.age")}
              <input className="input" id="thirty-age" min={18} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={plan.age} />
            </label>
            <label className="field-label" htmlFor="thirty-sex">
              {t("fields.sex")}
              <select className="input" id="thirty-sex" onChange={(event) => setPlan((current) => ({ ...current, sex: event.target.value as ThirtySex }))} value={plan.sex}>
                <option value="male">{t("options.sex.male")}</option>
                <option value="female">{t("options.sex.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="thirty-activity">
              {t("fields.activity")}
              <select className="input" id="thirty-activity" onChange={(event) => setPlan((current) => ({ ...current, activity: event.target.value as ThirtyActivity }))} value={plan.activity}>
                {Object.entries(thirtyActivityReferences).map(([key]) => (
                  <option key={key} value={key}>
                    {t(`options.activity.${key}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
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
              <strong>{result?.formattedProteinTarget ?? "30 g"}</strong>
              <span>{t("metrics.proteinTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCalories ?? "0 kcal"}</strong>
              <span>{t("metrics.burn")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.activityLabel ?? "--"}</strong>
              <span>{t("metrics.activity")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `MET ${result.met}` : "MET --"}</strong>
              <span>{t("metrics.sourceMet")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.proteinOptions ?? []).slice(0, 3).map((option) => (
              <div className="profile-row" key={option}>
                <span className="badge">{t("badges.protein")}</span>
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <SunMedium size={18} aria-hidden="true" />
            <span>
              <strong>{result?.activityTip ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {routineNotes.map((item, index) => (
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
