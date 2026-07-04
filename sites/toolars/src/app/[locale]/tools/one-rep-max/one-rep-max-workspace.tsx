"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Dumbbell, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateOneRepMax,
  defaultOneRepMaxScenario,
  type OneRepMaxInput,
  type OneRepMaxResult
} from "@/lib/tools/one-rep-max";

const storageKey = "toolars.one-rep-max.lift:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "training", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const strengthNotes = ["formula", "repRange", "safety"] as const;

export function OneRepMaxWorkspace() {
  const t = useTranslations("tools.one-rep-max.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [lift, setLift] = useState((): OneRepMaxInput => defaultOneRepMaxScenario);
  const [result, setResult] = useState(null as OneRepMaxResult | null);
  const accuracyKey = getAccuracyKey(lift.reps);
  const resultSummary = result
    ? t("resultSection.summary", {
        weightKg: formatCompact(cleanPositive(lift.weightKg)),
        reps: formatCompact(cleanReps(lift.reps))
      })
    : t("resultSection.emptyDescription");

  const calculate = () => {
    setResult(calculateOneRepMax(lift));
  };

  const saveLift = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lift));
    } catch {}
  };

  const updateNumber = (key: keyof OneRepMaxInput, value: string) => {
    setLift((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="one-rep-max">
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
          <a className="button button-outline" href={localizedHref("/tools/one-rep-max/about")}>
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
            <label className="field-label" htmlFor="one-rep-weight">
              {t("fields.weightKg")}
              <input className="input" id="one-rep-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={lift.weightKg} />
            </label>
            <label className="field-label" htmlFor="one-rep-reps">
              {t("fields.reps")}
              <input className="input" id="one-rep-reps" min={1} onChange={(event) => updateNumber("reps", event.target.value)} type="number" value={lift.reps} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveLift} type="button">
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge warn">{result ? t(`accuracy.${accuracyKey}`) : t("badges.epley")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedOneRepMax ?? t("metrics.emptyOneRepMax")}</strong>
              <span>{t("metrics.estimatedOneRepMax")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`accuracy.${accuracyKey}`) : t("metrics.pending")}</strong>
              <span>{t("metrics.accuracyBand")}</span>
            </article>
            <article className="llm-metric">
              <strong>{lift.reps}</strong>
              <span>{t("metrics.inputReps")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.percentageRows.length ?? 0}</strong>
              <span>{t("metrics.workingSets")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.percentageRows ?? []).map((row) => (
              <div className="profile-row" key={row.percentage}>
                <span className="badge">{row.percentage}%</span>
                <span>
                  <strong>{row.formattedWeight}</strong>
                  <small style={{ display: "block", marginTop: 2 }}>{t("percentageRows.label", { percentage: row.percentage, reps: row.reps })}</small>
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Dumbbell size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`recommendations.${accuracyKey}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {strengthNotes.map((item, index) => (
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

function getAccuracyKey(reps: number) {
  return cleanReps(reps) <= 10 ? "epleyReference" : "lowerAccuracy";
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function cleanReps(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.round(value);
}

function formatCompact(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
