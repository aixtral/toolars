"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, SunMedium } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateCoastFire,
  defaultCoastFireScenario,
  type CoastFireInput,
  type CoastFireResult
} from "@/lib/tools/coast-fire";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "advice", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const coastNotes = ["traditional", "coast", "assumptions"] as const;

export function CoastFireWorkspace() {
  const t = useTranslations("tools.coast-fire.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/coast-fire/about", localeCode);
  const [plan, setPlan] = useState(defaultCoastFireScenario);
  const [result, setResult] = useState(null as CoastFireResult | null);
  const statusBadge = result ? t(`badges.${result.statusTone}`) : t("badges.coast");

  const calculate = () => {
    setResult(calculateCoastFire(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.coast-fire.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof CoastFireInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="coast-fire">
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
            <label className="field-label" htmlFor="coast-current-age">
              {t("fields.currentAge")}
              <input className="input" id="coast-current-age" min={0} onChange={(event) => updateNumber("currentAge", event.target.value)} step="1" type="number" value={plan.currentAge} />
            </label>
            <label className="field-label" htmlFor="coast-retirement-age">
              {t("fields.retirementAge")}
              <input className="input" id="coast-retirement-age" min={0} onChange={(event) => updateNumber("retirementAge", event.target.value)} step="1" type="number" value={plan.retirementAge} />
            </label>
            <label className="field-label" htmlFor="coast-assets">
              {t("fields.currentAssets")}
              <input className="input" id="coast-assets" min={0} onChange={(event) => updateNumber("currentAssets", event.target.value)} step="1000" type="number" value={plan.currentAssets} />
            </label>
            <label className="field-label" htmlFor="coast-expenses">
              {t("fields.annualExpenses")}
              <input className="input" id="coast-expenses" min={0} onChange={(event) => updateNumber("annualExpenses", event.target.value)} step="1000" type="number" value={plan.annualExpenses} />
            </label>
            <label className="field-label" htmlFor="coast-return">
              {t("fields.annualReturn")}
              <input className="input" id="coast-return" onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="coast-withdrawal">
              {t("fields.withdrawalRate")}
              <input className="input" id="coast-withdrawal" min={0.1} onChange={(event) => updateNumber("withdrawalRate", event.target.value)} step="0.1" type="number" value={plan.withdrawalRate} />
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
            <span className={`badge ${result?.statusTone === "gap" ? "warn" : "local"}`}>{statusBadge}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedFireTarget ?? "$0"}</strong>
              <span>{t("metrics.fireTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedCoastTarget ?? "$0"}</strong>
              <span>{t("metrics.coastTarget")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedProgress ?? "0.0%"}</strong>
              <span>{t("metrics.progress")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedGapOrSurplus ?? "$0"}</strong>
              <span>{t("metrics.gapOrSurplus")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <SunMedium size={18} aria-hidden="true" />
            <span>
              <strong>{result?.statusTitle ?? t("callout.waitingTitle")}</strong>
              <small>{result?.statusText ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {coastNotes.map((item, index) => (
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
