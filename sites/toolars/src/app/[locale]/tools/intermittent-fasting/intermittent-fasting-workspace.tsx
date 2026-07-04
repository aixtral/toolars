"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Clock3, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateIntermittentFasting,
  defaultIntermittentFastingScenario,
  intermittentFastingProtocolOptions,
  type IntermittentFastingInput,
  type IntermittentFastingProtocol,
  type IntermittentFastingResult
} from "@/lib/tools/intermittent-fasting";

const storageKey = "toolars.intermittent-fasting.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "health", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const fastingNotes = [
  "windows",
  "omad",
  "fiveTwo"
] as const;

const protocolOptionKeys: Record<IntermittentFastingProtocol, "sixteenEight" | "eighteenSix" | "twentyFour" | "fourteenTen" | "omad" | "fiveTwo"> = {
  "16:8": "sixteenEight",
  "18:6": "eighteenSix",
  "20:4": "twentyFour",
  "14:10": "fourteenTen",
  OMAD: "omad",
  "5:2": "fiveTwo"
};

export function IntermittentFastingWorkspace() {
  const t = useTranslations("tools.intermittent-fasting.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/intermittent-fasting/about", localeCode);
  const [plan, setPlan] = useState(defaultIntermittentFastingScenario as IntermittentFastingInput);
  const [result, setResult] = useState(null as IntermittentFastingResult | null);
  const numberFormatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0
  });

  const calculate = () => {
    setResult(calculateIntermittentFasting(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof IntermittentFastingInput>(key: Key, value: IntermittentFastingInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const formatHours = (hours: number) => t("formats.hours", { count: numberFormatter.format(hours) });
  const formatNextDayRange = (start: string, end: string) => t("formats.timeRangeNextDay", { start, end });
  const formatProtocol = (protocol: IntermittentFastingProtocol) => t(`protocolOptions.${protocolOptionKeys[protocol]}`);
  const eatingEndTime = result ? addHours(normalizeTime(plan.lastMealTime), result.fastingHours + result.eatingHours) : "--";
  const timelineRows = result
    ? plan.protocol === "5:2"
      ? [
          {
            label: t("timeline.protocol52Label"),
            value: t("timeline.protocol52Value"),
            tone: "neutral" as const
          }
        ]
      : [
          { label: t("timeline.lastMealEnds"), value: normalizeTime(plan.lastMealTime), tone: "neutral" as const },
          { label: t("timeline.fastingBegins"), value: normalizeTime(plan.lastMealTime), tone: "neutral" as const },
          { label: t("timeline.youMayEat"), value: result.nextMealTime, tone: "active" as const },
          { label: t("timeline.eatingWindowCloses"), value: eatingEndTime, tone: "neutral" as const }
        ]
    : [];

  return (
    <div className="llm-cost-layout" data-tool-workspace="intermittent-fasting">
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
            <label className="field-label" htmlFor="fasting-protocol">
              {t("fields.protocol")}
              <select className="input" id="fasting-protocol" onChange={(event) => updatePlan("protocol", event.target.value as IntermittentFastingProtocol)} value={plan.protocol}>
                {intermittentFastingProtocolOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {formatProtocol(option.value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="fasting-last-meal">
              {t("fields.lastMealTime")}
              <input className="input" id="fasting-last-meal" onChange={(event) => updatePlan("lastMealTime", event.target.value)} type="time" value={plan.lastMealTime} />
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
                      protocol: formatProtocol(plan.protocol),
                      time: normalizeTime(plan.lastMealTime)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.schedule")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.nextMealTime ?? "--"}</strong>
              <span>{t("metrics.nextMeal")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatHours(result.displayFastingHours) : formatHours(0)}</strong>
              <span>{t("metrics.fastingDuration")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.eatingWindow ?? "--"}</strong>
              <span>{t("metrics.eatingWindow")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatNextDayRange(eatingEndTime, result.nextMealTime) : "--"}</strong>
              <span>{t("metrics.fastingWindow")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {timelineRows.map((row) => (
              <div className="profile-row" key={row.label}>
                <span className={`badge ${row.tone === "active" ? "local" : ""}`}>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Clock3 size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(plan.protocol === "5:2" ? "recommendations.protocol52" : "recommendations.standard") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {fastingNotes.map((item, index) => (
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

function normalizeTime(value: string): string {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const hours = Number.isFinite(hourValue) ? hourValue : 20;
  const minutes = Number.isFinite(minuteValue) ? minuteValue : 0;
  return `${mod(hours, 24).toString().padStart(2, "0")}:${mod(minutes, 60).toString().padStart(2, "0")}`;
}

function addHours(value: string, hours: number): string {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const totalMinutes = hourValue * 60 + minuteValue + hours * 60;
  const normalized = mod(totalMinutes, 24 * 60);
  const nextHours = Math.floor(normalized / 60);
  const nextMinutes = normalized % 60;
  return `${nextHours.toString().padStart(2, "0")}:${nextMinutes.toString().padStart(2, "0")}`;
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
