"use client";
import { useLocale, useTranslations } from "next-intl";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { bodyRecompositionActivityLevels, bodyRecompositionGoals, calculateBodyRecomposition, defaultBodyRecompositionScenario, type BodyRecompositionGoal, type BodyRecompositionInput, type BodyRecompositionResult, type BodyRecompositionSex } from "@/lib/tools/body-recomposition";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const recompNotes = ["training", "protein", "recovery"] as const;
const activityOptionKeys = ["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "extremelyActive"] as const;
const goalOptionKeys: Record<BodyRecompositionGoal, "recomp" | "slowCut" | "maintain"> = {
  "slow-cut": "slowCut",
  maintain: "maintain",
  recomp: "recomp"
};

export function BodyRecompositionWorkspace() {
  const t = useTranslations("tools.body-recomposition.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/body-recomposition/about", localeCode);
  const [plan, setPlan] = useState(defaultBodyRecompositionScenario as BodyRecompositionInput);
  const [result, setResult] = useState(null as BodyRecompositionResult | null);

  const calculate = () => {
    setResult(calculateBodyRecomposition(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.body-recomposition.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Pick<BodyRecompositionInput, "age" | "heightCm" | "weightKg" | "activityMultiplier">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: BodyRecompositionSex) => {
    setPlan((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  const updateGoal = (value: BodyRecompositionGoal) => {
    setPlan((current) => ({ ...current, goal: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="body-recomposition">
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
            <label className="field-label" htmlFor="recomp-sex">
              {t("fields.sex")}
              <select className="input" id="recomp-sex" onChange={(event) => updateSex(event.target.value as BodyRecompositionSex)} value={plan.sex}>
                <option value="male">{t("options.sex.male")}</option>
                <option value="female">{t("options.sex.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="recomp-age">
              {t("fields.age")}
              <input className="input" id="recomp-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={plan.age} />
            </label>
            <label className="field-label" htmlFor="recomp-height">
              {t("fields.heightCm")}
              <input className="input" id="recomp-height" min={0} onChange={(event) => updateNumber("heightCm", event.target.value)} type="number" value={plan.heightCm} />
            </label>
            <label className="field-label" htmlFor="recomp-weight">
              {t("fields.weightKg")}
              <input className="input" id="recomp-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={plan.weightKg} />
            </label>
            <label className="field-label" htmlFor="recomp-activity">
              {t("fields.activityLevel")}
              <select className="input" id="recomp-activity" onChange={(event) => updateNumber("activityMultiplier", event.target.value)} value={plan.activityMultiplier}>
                {bodyRecompositionActivityLevels.map((level, index) => (
                  <option key={level.value} value={level.value}>
                    {t(`options.activity.${activityOptionKeys[index]}`)} ({level.value})
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="recomp-goal">
              {t("fields.goal")}
              <select className="input" id="recomp-goal" onChange={(event) => updateGoal(event.target.value as BodyRecompositionGoal)} value={plan.goal}>
                {bodyRecompositionGoals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {t(`options.goals.${goalOptionKeys[goal.value]}`)} (-{goal.deficit} kcal)
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
            <span className="badge warn">{t("badges.recomp")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTargetCalories ?? "0 kcal"}</strong>
              <span>{t("metrics.targetCalories")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTdee ?? "0 kcal"}</strong>
              <span>{t("metrics.tdee")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProtein ?? "0 g"}</strong>
              <span>{t("metrics.protein")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCarbs ?? "0 g"}</strong>
              <span>{t("metrics.carbs")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFat ?? "0 g"}</strong>
              <span>{t("metrics.fat")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.macroPercentSummary ?? t("callout.waitingTitle")}</strong>
              <small>{result?.recommendation ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {recompNotes.map((item, index) => (
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
