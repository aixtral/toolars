"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Clock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateRuleOf72,
  defaultRuleOf72Scenario,
  type RuleOf72Input,
  type RuleOf72Result
} from "@/lib/tools/rule-of-72";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "shortcut", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const shortcutNotes = [
  "formula",
  "exact",
  "context"
] as const;

export function RuleOf72Workspace() {
  const t = useTranslations("tools.rule-of-72.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultRuleOf72Scenario as RuleOf72Input);
  const [result, setResult] = useState(null as RuleOf72Result | null);

  const calculate = () => {
    setResult(calculateRuleOf72(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.rule-of-72.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof RuleOf72Input, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="rule-of-72">
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
          <a className="button button-outline" href={localizedHref("/tools/rule-of-72/about")}>
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
            <label className="field-label" htmlFor="rule-return">
              {t("fields.annualReturn")}
              <input className="input" id="rule-return" min={0} onChange={(event) => updateNumber("annualReturn", event.target.value)} step="0.1" type="number" value={plan.annualReturn} />
            </label>
            <label className="field-label" htmlFor="rule-principal">
              {t("fields.principal")}
              <input className="input" id="rule-principal" min={0} onChange={(event) => updateNumber("principal", event.target.value)} step="1" type="number" value={plan.principal} />
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
                      rate: plan.annualReturn.toFixed(2),
                      years: t("values.yearsOneDecimal", { value: result.ruleYears.toFixed(1) })
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className={`badge ${result?.accuracyTone === "rough" ? "warn" : "local"}`}>
              {result ? t(`badges.${result.accuracyTone}`) : t("badges.rule")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{t("values.yearsOneDecimal", { value: result ? result.ruleYears.toFixed(1) : "0.0" })}</strong>
              <span>{t("metrics.ruleYears")}</span>
            </article>
            <article className="llm-metric">
              <strong>{t("values.yearsTwoDecimal", { value: result ? result.exactYears.toFixed(2) : "0.00" })}</strong>
              <span>{t("metrics.exactYears")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDoubledValue ?? "$0"}</strong>
              <span>{t("metrics.doubledValue")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedReverseTenYearRate ?? "0.0%"}</strong>
              <span>{t("metrics.reverseTenYearRate")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Clock size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("callout.readyTitle") : t("callout.waitingTitle")}</strong>
              <small>
                {result
                  ? t("callout.readyDescription", { value: result.schedule[0]?.formattedValue ?? "$0" })
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
          {shortcutNotes.map((item, index) => (
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
