"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Percent, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculatePercentage,
  defaultPercentageScenarios,
  type PercentageInput,
  type PercentageMode,
  type PercentageResult
} from "@/lib/tools/percentage-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "context", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const denominatorNotes = ["percentOf", "ratio", "change"] as const;

export function PercentageCalculatorWorkspace() {
  const t = useTranslations("tools.percentage-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/percentage-calculator/about", localeCode);
  const [plan, setPlan] = useState(defaultPercentageScenarios.percentOf as PercentageInput);
  const [result, setResult] = useState(null as PercentageResult | null);

  const calculate = () => {
    setResult(calculatePercentage(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.percentage-calculator.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateMode = (value: string) => {
    setPlan(defaultPercentageScenarios[value as PercentageMode]);
    setResult(null);
  };

  const updateNumber = (key: keyof Omit<PercentageInput, "mode">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="percentage-calculator">
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
            <label className="field-label" htmlFor="percentage-mode">
              {t("fields.mode")}
              <select className="input" id="percentage-mode" onChange={(event) => updateMode(event.target.value)} value={plan.mode}>
                <option value="percentOf">{t("options.percentOf")}</option>
                <option value="ratio">{t("options.ratio")}</option>
                <option value="change">{t("options.change")}</option>
              </select>
            </label>

            {plan.mode === "percentOf" ? (
              <>
                <label className="field-label" htmlFor="percentage-percent">
                  {t("fields.percent")}
                  <input className="input" id="percentage-percent" onChange={(event) => updateNumber("percent", event.target.value)} step="0.1" type="number" value={plan.percent} />
                </label>
                <label className="field-label" htmlFor="percentage-base">
                  {t("fields.baseValue")}
                  <input className="input" id="percentage-base" onChange={(event) => updateNumber("baseValue", event.target.value)} step="0.01" type="number" value={plan.baseValue} />
                </label>
              </>
            ) : null}

            {plan.mode === "ratio" ? (
              <>
                <label className="field-label" htmlFor="percentage-part">
                  {t("fields.partValue")}
                  <input className="input" id="percentage-part" onChange={(event) => updateNumber("partValue", event.target.value)} step="0.01" type="number" value={plan.partValue} />
                </label>
                <label className="field-label" htmlFor="percentage-whole">
                  {t("fields.wholeValue")}
                  <input className="input" id="percentage-whole" onChange={(event) => updateNumber("wholeValue", event.target.value)} step="0.01" type="number" value={plan.wholeValue} />
                </label>
              </>
            ) : null}

            {plan.mode === "change" ? (
              <>
                <label className="field-label" htmlFor="percentage-from">
                  {t("fields.fromValue")}
                  <input className="input" id="percentage-from" onChange={(event) => updateNumber("fromValue", event.target.value)} step="0.01" type="number" value={plan.fromValue} />
                </label>
                <label className="field-label" htmlFor="percentage-to">
                  {t("fields.toValue")}
                  <input className="input" id="percentage-to" onChange={(event) => updateNumber("toValue", event.target.value)} step="0.01" type="number" value={plan.toValue} />
                </label>
              </>
            ) : null}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={savePlan} type="button">
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
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
            <span className="badge local">{result?.direction ?? t("badges.percent")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedResult ?? "0"}</strong>
              <span>{t("metrics.result")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.modeLabel ?? t(`options.${plan.mode}`)}</strong>
              <span>{t("metrics.mode")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.directionLabel ?? "-"}</strong>
              <span>{t("metrics.direction")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("metrics.checked") : "-"}</strong>
              <span>{t("metrics.denominator")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Percent size={18} aria-hidden="true" />
            <span>
              <strong>{result?.formulaNote ?? t("callout.waitingTitle")}</strong>
              <small>{result?.denominatorNote ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {denominatorNotes.map((item, index) => (
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
