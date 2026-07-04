"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSmokeFree,
  defaultSmokeFreeScenario,
  type SmokeFreeInput,
  type SmokeFreeResult
} from "@/lib/tools/smoke-free";

const storageKey = "toolars.smoke-free.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "health", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const recoveryNotes = [
  "days",
  "lifeExtension",
  "support"
] as const;

const milestoneKeysByDay = {
  0: "d0",
  1: "d1",
  3: "d3",
  14: "d14",
  90: "d90",
  365: "d365",
  1825: "d1825",
  3650: "d3650",
  5475: "d5475"
} as const;

export function SmokeFreeWorkspace() {
  const t = useTranslations("tools.smoke-free.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [values, setValues] = useState(defaultSmokeFreeScenario as SmokeFreeInput);
  const [result, setResult] = useState(null as SmokeFreeResult | null);
  const nextMilestoneKey = result?.nextMilestone ? getMilestoneKey(result.nextMilestone.days) : undefined;
  const smokeFreeDays = result ? formatInteger(result.daysSmokeFree) : "0";
  const resultSummary = result
    ? result.daysSmokeFree > 0
      ? t("resultSection.summary", { days: smokeFreeDays })
      : t("resultSection.startingToday")
    : t("resultSection.emptyDescription");
  const calloutTitle = result
    ? nextMilestoneKey
      ? t("callout.nextTitle", { time: t(`milestones.${nextMilestoneKey}.time`) })
      : t("callout.completeTitle")
    : t("callout.waitingTitle");
  const calloutDescription = result
    ? nextMilestoneKey
      ? t(`milestones.${nextMilestoneKey}.message`)
      : t("callout.completeDescription")
    : t("callout.waitingDescription");

  const calculate = () => {
    setResult(calculateSmokeFree(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<SmokeFreeInput, "cigarettesPerDay" | "pricePerPack" | "cigarettesPerPack">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateQuitDate = (value: string) => {
    setValues((current) => ({ ...current, quitDate: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="smoke-free">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {trustRows.map(({ key, tone }) => (
            <div className="profile-row" key={key}>
              <span className={tone ? `badge ${tone}` : "badge"}>{t(`trustRows.${key}.label`)}</span>
              <span>{t(`trustRows.${key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/smoke-free/about")}>
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
            <label className="field-label" htmlFor="smoke-quit-date">
              {t("fields.quitDate")}
              <input className="input" id="smoke-quit-date" onChange={(event) => updateQuitDate(event.target.value)} type="date" value={values.quitDate} />
            </label>
            <label className="field-label" htmlFor="smoke-cigs-per-day">
              {t("fields.cigarettesPerDay")}
              <input className="input" id="smoke-cigs-per-day" min={0} onChange={(event) => updateNumber("cigarettesPerDay", event.target.value)} step="1" type="number" value={values.cigarettesPerDay} />
            </label>
            <label className="field-label" htmlFor="smoke-price-per-pack">
              {t("fields.pricePerPack")}
              <input className="input" id="smoke-price-per-pack" min={0} onChange={(event) => updateNumber("pricePerPack", event.target.value)} step="0.01" type="number" value={values.pricePerPack} />
            </label>
            <label className="field-label" htmlFor="smoke-cigs-per-pack">
              {t("fields.cigarettesPerPack")}
              <input className="input" id="smoke-cigs-per-pack" min={1} onChange={(event) => updateNumber("cigarettesPerPack", event.target.value)} step="1" type="number" value={values.cigarettesPerPack} />
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge local">{result ? t("badges.progress") : t("badges.tracker")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? t("metrics.daysValue", { days: smokeFreeDays }) : t("metrics.zeroDays")}</strong>
              <span>{t("metrics.smokeFree")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMoneySaved ?? "$0"}</strong>
              <span>{t("metrics.moneySaved")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("metrics.cigarettesValue", { count: formatInteger(result.cigarettesAvoided) }) : t("metrics.zeroCigarettes")}</strong>
              <span>{t("metrics.notSmoked")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("metrics.lifeDaysValue", { days: formatDecimal(result.lifeExtendedDays) }) : t("metrics.zeroLifeDays")}</strong>
              <span>{t("metrics.lifeEstimate")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{calloutTitle}</strong>
              <small>{calloutDescription}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {recoveryNotes.map((item, index) => (
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

function getMilestoneKey(days: number) {
  return milestoneKeysByDay[days as keyof typeof milestoneKeysByDay];
}

function formatInteger(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatDecimal(value: number): string {
  return value.toFixed(1);
}
