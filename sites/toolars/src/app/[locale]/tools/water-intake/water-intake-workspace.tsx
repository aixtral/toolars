"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Droplets, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateWaterIntake, climateOptions, defaultWaterIntakeScenario, waterActivityLevels, type WaterIntakeInput, type WaterIntakeResult } from "@/lib/tools/water-intake";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const hydrationNotes = [
  "base",
  "adjustments",
  "medical"
] as const;

const initialWaterIntakePlan = (): WaterIntakeInput => defaultWaterIntakeScenario;
const initialWaterIntakeResult = (): WaterIntakeResult | null => null;

export function WaterIntakeWorkspace() {
  const t = useTranslations("tools.water-intake.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(initialWaterIntakePlan);
  const [result, setResult] = useState(initialWaterIntakeResult);
  const activityKey = getActivityOptionKey(plan.activityMultiplier);
  const climateKey = getClimateOptionKey(plan.climateAdjustment);

  const calculate = () => {
    setResult(calculateWaterIntake(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.water-intake.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof WaterIntakeInput, value: string) => {
    setPlan((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="water-intake">
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
          <a className="button button-outline" href={localizedHref("/tools/water-intake/about")}>
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
            <label className="field-label" htmlFor="water-weight">
              {t("fields.weight")}
              <input className="input" id="water-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="water-activity">
              {t("fields.activity")}
              <select className="input" id="water-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={plan.activityMultiplier}>
                {waterActivityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {t(`activityOptions.${getActivityOptionKey(level.value)}`, { value: level.value })} ({level.value})
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="water-climate">
              {t("fields.climate")}
              <select className="input" id="water-climate" onChange={(event) => updateNumber("climateAdjustment", event.target.value)} value={plan.climateAdjustment}>
                {climateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`climateOptions.${getClimateOptionKey(option.value)}`)} ({option.value >= 0 ? "+" : ""}{option.value})
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
              <p className="tool-description">
                {result
                  ? t("resultSection.summary", {
                      weight: formatNumber(Math.round(cleanNumber(plan.weightKg))),
                      activity: t(`activityOptions.${activityKey}`, { value: plan.activityMultiplier }),
                      climate: t(`climateOptions.${climateKey}`)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotal ?? "0 ml"}</strong>
              <span>{t("metrics.dailyTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{t("metrics.cupsValue", { cups: result?.cups ?? 0 })}</strong>
              <span>{t("metrics.cups")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBaseNeed ?? "0 ml"}</strong>
              <span>{t("metrics.baseNeed")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedActivityExtra ?? "+0 ml"}</strong>
              <span>{t("metrics.activityExtra")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedClimateExtra ?? "+0 ml"}</strong>
              <span>{t("metrics.climateExtra")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Droplets size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("resultSection.recommendation") : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.adjustmentDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {hydrationNotes.map((item, index) => (
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

function getActivityOptionKey(value: number) {
  if (Math.abs(value - 1) < 0.001) return "sedentary";
  if (Math.abs(value - 1.2) < 0.001) return "moderate";
  if (Math.abs(value - 1.5) < 0.001) return "active";
  if (Math.abs(value - 1.8) < 0.001) return "veryActive";
  return "custom";
}

function getClimateOptionKey(value: number) {
  if (Math.abs(value) < 0.001) return "temperate";
  if (Math.abs(value - 0.5) < 0.001) return "hot";
  if (Math.abs(value + 0.3) < 0.001) return "cold";
  return "custom";
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
