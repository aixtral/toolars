"use client";
import { useLocale, useTranslations } from "next-intl";

import { CalendarDays, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculatePregnancyDueDate,
  defaultPregnancyDueDateScenario,
  type PregnancyDueDateInput,
  type PregnancyDueDateResult
} from "@/lib/tools/pregnancy-due-date";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "medical", tone: "warn" },
  { key: "privacy", tone: "" }
] as const;

const medicalNotes = [
  "estimate",
  "clinicalContext",
  "urgentCare"
] as const;

export function PregnancyDueDateWorkspace() {
  const t = useTranslations("tools.pregnancy-due-date.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [timeline, setTimeline] = useState(defaultPregnancyDueDateScenario as PregnancyDueDateInput);
  const [result, setResult] = useState(null as PregnancyDueDateResult | null);
  const numberFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });
  const dateFormatter = new Intl.DateTimeFormat(localeCode, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  });

  const calculate = () => {
    setResult(calculatePregnancyDueDate(timeline));
  };

  const saveTimeline = () => {
    window.localStorage.setItem("toolars.pregnancy-due-date.timeline", JSON.stringify(timeline));
  };

  const updateTimeline = (key: keyof PregnancyDueDateInput, value: string) => {
    setTimeline((current) => ({
      ...current,
      [key]: key === "cycleLengthDays" ? Number(value) : value
    }));
    setResult(null);
  };

  const formatDays = (days: number) => t("formats.days", { count: numberFormatter.format(days) });
  const formatDate = (value: string) => dateFormatter.format(parseIsoDate(value));
  const formatGestationalAge = (daysPregnant: number) => {
    if (daysPregnant < 0) return t("formats.notPregnant");
    return t("formats.weekDay", {
      weeks: numberFormatter.format(Math.floor(daysPregnant / 7)),
      days: numberFormatter.format(daysPregnant % 7)
    });
  };
  const formatTrimester = (daysPregnant: number) => t(`trimesters.${getTrimesterKey(daysPregnant)}`);
  const formatDaysRemaining = (daysRemaining: number) => (daysRemaining > 0 ? formatDays(daysRemaining) : t("formats.dueNow"));
  const formatSummary = (pregnancyResult: PregnancyDueDateResult) =>
    pregnancyResult.daysPregnant >= 0
      ? t("resultSection.summary", {
          pregnantDays: numberFormatter.format(pregnancyResult.daysPregnant),
          totalDays: numberFormatter.format(pregnancyResult.totalDays)
        })
      : t("resultSection.selectBeforeToday");

  return (
    <div className="llm-cost-layout" data-tool-workspace="pregnancy-due-date">
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
          <a className="button button-outline" href={localizedHref("/tools/pregnancy-due-date/about")}>
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
            <label className="field-label" htmlFor="pregnancy-lmp">
              {t("fields.lmp")}
              <input className="input" id="pregnancy-lmp" onChange={(event) => updateTimeline("lmpDate", event.target.value)} type="date" value={timeline.lmpDate} />
            </label>
            <label className="field-label" htmlFor="pregnancy-cycle">
              {t("fields.cycleLength")}
              <select className="input" id="pregnancy-cycle" onChange={(event) => updateTimeline("cycleLengthDays", event.target.value)} value={timeline.cycleLengthDays}>
                {Array.from({ length: 15 }, (_, index) => index + 21).map((days) => (
                  <option key={days} value={days}>
                    {formatDays(days)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveTimeline} type="button">
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
              <p className="tool-description">{result ? formatSummary(result) : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatDate(result.dueDate) : "--"}</strong>
              <span>{t("metrics.dueDate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatGestationalAge(result.daysPregnant) : "--"}</strong>
              <span>{t("metrics.currentWeek")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatTrimester(result.daysPregnant) : "--"}</strong>
              <span>{t("metrics.trimester")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatDaysRemaining(result.daysRemaining) : "--"}</strong>
              <span>{t("metrics.daysUntilDue")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>{result ? formatDate(result.conceptionDate) : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("formats.progress", {
                      percent: numberFormatter.format(result.progressPercent)
                    })
                  : t("callout.waitingDescription")}
              </small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {medicalNotes.map((item, index) => (
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

function parseIsoDate(value: string): Date {
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getTrimesterKey(daysPregnant: number): "first" | "second" | "third" | "overdue" | "notPregnant" {
  if (daysPregnant < 0) return "notPregnant";
  const weeks = Math.floor(daysPregnant / 7);
  if (weeks < 14) return "first";
  if (weeks < 28) return "second";
  if (weeks <= 42) return "third";
  return "overdue";
}
