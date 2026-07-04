"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, PiggyBank, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSavingsChallenge,
  defaultSavingsChallengeScenario,
  type SavingsChallengeInput,
  type SavingsChallengeMode,
  type SavingsChallengeResult
} from "@/lib/tools/savings-challenge";

type NumericSavingsField =
  | "startingAmount"
  | "weeklyIncrease"
  | "envelopeCount"
  | "monthlyIncome"
  | "essentialExpenses"
  | "savingsGoal"
  | "alreadySaved"
  | "targetMonths";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "flexible", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const challengeNotes = ["week52", "envelope", "reverse"] as const;
const challengeModeOptions = [
  { value: "52week", key: "week52" },
  { value: "envelope", key: "envelope" },
  { value: "nospend", key: "nospend" },
  { value: "reverse", key: "reverse" }
] as const;

export function SavingsChallengeWorkspace() {
  const t = useTranslations("tools.savings-challenge.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/savings-challenge/about", localeCode);
  const [plan, setPlan] = useState<SavingsChallengeInput>(() => {
    return defaultSavingsChallengeScenario;
  });
  const [result, setResult] = useState<SavingsChallengeResult | null>(null);

  const calculate = () => {
    setResult(calculateSavingsChallenge(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem("toolars.savings-challenge.plan", JSON.stringify(plan));
    } catch {}
  };

  const updateNumber = (key: NumericSavingsField, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: string) => {
    setPlan((current) => ({ ...current, mode: value as SavingsChallengeMode }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="savings-challenge">
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
            <label className="field-label" htmlFor="savings-mode">
              {t("fields.mode")}
              <select className="input" id="savings-mode" onChange={(event) => updateMode(event.target.value)} value={plan.mode}>
                {challengeModeOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {t(`options.mode.${option.key}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="savings-currency">
              {t("fields.currency")}
              <input className="input" id="savings-currency" onChange={(event) => setPlan((current) => ({ ...current, currency: event.target.value || "¥" }))} type="text" value={plan.currency} />
            </label>
            <label className="field-label" htmlFor="savings-start">
              {t("fields.startingAmount")}
              <input className="input" id="savings-start" min={0} onChange={(event) => updateNumber("startingAmount", event.target.value)} type="number" value={plan.startingAmount} />
            </label>
            <label className="field-label" htmlFor="savings-increase">
              {t("fields.weeklyIncrease")}
              <input className="input" id="savings-increase" min={0} onChange={(event) => updateNumber("weeklyIncrease", event.target.value)} type="number" value={plan.weeklyIncrease} />
            </label>
            <label className="field-label" htmlFor="savings-envelopes">
              {t("fields.envelopeCount")}
              <input className="input" id="savings-envelopes" min={1} onChange={(event) => updateNumber("envelopeCount", event.target.value)} type="number" value={plan.envelopeCount} />
            </label>
            <label className="field-label" htmlFor="savings-goal">
              {t("fields.savingsGoal")}
              <input className="input" id="savings-goal" min={0} onChange={(event) => updateNumber("savingsGoal", event.target.value)} type="number" value={plan.savingsGoal} />
            </label>
            <label className="field-label" htmlFor="savings-saved">
              {t("fields.alreadySaved")}
              <input className="input" id="savings-saved" min={0} onChange={(event) => updateNumber("alreadySaved", event.target.value)} type="number" value={plan.alreadySaved} />
            </label>
            <label className="field-label" htmlFor="savings-months">
              {t("fields.targetMonths")}
              <input className="input" id="savings-months" min={1} onChange={(event) => updateNumber("targetMonths", event.target.value)} type="number" value={plan.targetMonths} />
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
            <span className="badge local">{result ? result.frequencyLabel : t("badges.challenge")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotal ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.totalSaved")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverage ?? t("metrics.emptyCurrency")}</strong>
              <span>{t("metrics.averageAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.durationLabel ?? t("metrics.emptyDuration")}</strong>
              <span>{t("metrics.duration")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.schedule.length) : t("metrics.emptyCount")}</strong>
              <span>{t("metrics.scheduleRows")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <PiggyBank size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.generatedTitle", { frequency: result.frequencyLabel }) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.generatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {challengeNotes.map((item, index) => (
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
