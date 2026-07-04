"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, CalendarDays, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateOvulation,
  defaultOvulationScenario,
  type OvulationInput,
  type OvulationResult
} from "@/lib/tools/ovulation-calculator";

const storageKey = "toolars.ovulation-calculator.cycle:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "health", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const cycleNotes = [
  "ovulation",
  "fertileWindow",
  "care"
] as const;

export function OvulationCalculatorWorkspace() {
  const t = useTranslations("tools.ovulation-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [cycle, setCycle] = useState(defaultOvulationScenario);
  const [result, setResult] = useState(null as OvulationResult | null);
  const numberFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });
  const dateFormatter = new Intl.DateTimeFormat(localeCode, {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  });

  const calculate = () => {
    setResult(calculateOvulation(cycle));
  };

  const saveCycle = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cycle));
    } catch {}
  };

  const updateCycle = (key: keyof OvulationInput, value: string) => {
    setCycle((current) => ({
      ...current,
      [key]: key === "lastPeriodDate" ? value : Number(value)
    }));
    setResult(null);
  };

  const formatDays = (days: number) => t("formats.days", { count: numberFormatter.format(days) });
  const formatShortDate = (date: string) => dateFormatter.format(parseIsoDate(date));
  const formatDateRange = (startDate: string, endDate: string) =>
    t("formats.dateRange", {
      start: formatShortDate(startDate),
      end: formatShortDate(endDate)
    });

  return (
    <div className="llm-cost-layout" data-tool-workspace="ovulation-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/ovulation-calculator/about")}>
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
            <label className="field-label" htmlFor="ovulation-lmp">
              {t("fields.lastPeriod")}
              <input className="input" id="ovulation-lmp" onChange={(event) => updateCycle("lastPeriodDate", event.target.value)} type="date" value={cycle.lastPeriodDate} />
            </label>
            <label className="field-label" htmlFor="ovulation-cycle">
              {t("fields.cycleLength")}
              <select className="input" id="ovulation-cycle" onChange={(event) => updateCycle("cycleLengthDays", event.target.value)} value={cycle.cycleLengthDays}>
                {Array.from({ length: 15 }, (_, index) => index + 21).map((days) => (
                  <option key={days} value={days}>
                    {formatDays(days)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="ovulation-period">
              {t("fields.periodDuration")}
              <select className="input" id="ovulation-period" onChange={(event) => updateCycle("periodDurationDays", event.target.value)} value={cycle.periodDurationDays}>
                {Array.from({ length: 5 }, (_, index) => index + 3).map((days) => (
                  <option key={days} value={days}>
                    {formatDays(days)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveCycle} type="button">
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
                      cycleLength: numberFormatter.format(cycle.cycleLengthDays),
                      periodDuration: numberFormatter.format(cycle.periodDurationDays)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatShortDate(result.ovulationDate) : "--"}</strong>
              <span>{t("metrics.ovulation")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatDateRange(result.fertileStartDate, result.fertileEndDate) : "--"}</strong>
              <span>{t("metrics.fertileWindow")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatShortDate(result.nextPeriodDate) : "--"}</strong>
              <span>{t("metrics.nextPeriod")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatDateRange(result.safeStartDate, result.safeEndDate) : "--"}</strong>
              <span>{t("metrics.safePeriod")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>{result ? formatDateRange(cycle.lastPeriodDate, result.menstruationEndDate) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {cycleNotes.map((item, index) => (
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
