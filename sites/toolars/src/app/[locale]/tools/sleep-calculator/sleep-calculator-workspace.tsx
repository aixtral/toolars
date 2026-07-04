"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Moon, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSleepSchedule,
  defaultSleepScenario,
  type SleepInput,
  type SleepMode,
  type SleepResult
} from "@/lib/tools/sleep-calculator";

const storageKey = "toolars.sleep-calculator.plan:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "gentle", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const sleepNotes = ["cycles", "defaultModel", "cutoffs"] as const;

export function SleepCalculatorWorkspace() {
  const t = useTranslations("tools.sleep-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/sleep-calculator/about", localeCode);
  const [plan, setPlan] = useState((): SleepInput => ({ ...defaultSleepScenario }));
  const [result, setResult] = useState(null as SleepResult | null);

  const calculate = () => {
    setResult(calculateSleepSchedule(plan));
  };

  const savePlan = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {}
  };

  const updatePlan = <Key extends keyof SleepInput>(key: Key, value: SleepInput[Key]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="sleep-calculator">
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
            <label className="field-label" htmlFor="sleep-mode">
              {t("fields.mode")}
              <select className="input" id="sleep-mode" onChange={(event) => updatePlan("mode", event.target.value as SleepMode)} value={plan.mode}>
                <option value="wakeup">{t("fields.wakeup")}</option>
                <option value="bedtime">{t("fields.bedtime")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="sleep-main-time">
              {t("fields.mainTime")}
              <input className="input" id="sleep-main-time" onChange={(event) => updatePlan("mainTime", event.target.value)} type="time" value={plan.mainTime} />
            </label>
            <label className="field-label" htmlFor="sleep-latency">
              {t("fields.latency")}
              <input className="input" id="sleep-latency" min={0} onChange={(event) => updatePlan("fallAsleepMinutes", Number(event.target.value))} type="number" value={plan.fallAsleepMinutes} />
            </label>
            <label className="field-label" htmlFor="sleep-cycle">
              {t("fields.cycleLength")}
              <input className="input" id="sleep-cycle" min={1} onChange={(event) => updatePlan("cycleLengthMinutes", Number(event.target.value))} type="number" value={plan.cycleLengthMinutes} />
            </label>
            <label className="field-label" htmlFor="sleep-caffeine">
              {t("fields.caffeineCutoff")}
              <input className="input" id="sleep-caffeine" min={0} onChange={(event) => updatePlan("caffeineCutoffHours", Number(event.target.value))} type="number" value={plan.caffeineCutoffHours} />
            </label>
            <label className="field-label" htmlFor="sleep-screen">
              {t("fields.screenCutoff")}
              <input className="input" id="sleep-screen" min={0} onChange={(event) => updatePlan("screenCutoffHours", Number(event.target.value))} step="0.5" type="number" value={plan.screenCutoffHours} />
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
              <p className="tool-description">{result ? result.resultLabel : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{result?.modeLabel ?? t("badges.cycle")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.primaryTime ?? "--"}</strong>
              <span>{t("metrics.primaryTime")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.caffeineCutoff ?? "--"}</strong>
              <span>{t("metrics.caffeineCutoff")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.screenCutoff ?? "--"}</strong>
              <span>{t("metrics.screenCutoff")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.morningLight ?? "--"}</strong>
              <span>{t("metrics.morningLight")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.options ?? []).map((option) => (
              <div className="profile-row" key={option.cycles}>
                <span className="badge">{t("options.cycles", { cycles: option.cycles })}</span>
                <span>
                  <strong>{option.time}</strong> - {t("options.asleep", { hours: option.hours })}
                </span>
              </div>
            ))}
          </div>

          <div className="llm-plan-callout">
            <Moon size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.dinnerCutoff", { time: result.dinnerCutoff }) : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {sleepNotes.map((item, index) => (
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
