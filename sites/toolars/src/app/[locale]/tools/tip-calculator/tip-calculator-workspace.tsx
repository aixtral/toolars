"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Receipt, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateTip, defaultTipScenario, type TipInput, type TipResult } from "@/lib/tools/tip-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const tipNotes = ["formula", "split", "tax"] as const;

function formatTipPercent(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(2)}%`;
}

export function TipCalculatorWorkspace() {
  const t = useTranslations("tools.tip-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState(defaultTipScenario as TipInput);
  const [result, setResult] = useState(null as TipResult | null);

  const calculate = () => {
    setResult(calculateTip(plan));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const savePlan = () => {
    window.localStorage.setItem("toolars.tip-calculator.plan", JSON.stringify(plan));
    flashSaved();
  };

  const updateNumber = (key: keyof TipInput, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const resultSummary = result
    ? t("resultSection.summary", {
        percent: formatTipPercent(result.tipPercent),
        people: result.people
      })
    : t("resultSection.emptyDescription");

  return (
    <div className="llm-cost-layout" data-tool-workspace="tip-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/tip-calculator/about")}>
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
            <label className="field-label" htmlFor="tip-bill">
              {t("fields.billAmount")}
              <input className="input" id="tip-bill" min={0} onChange={(event) => updateNumber("billAmount", event.target.value)} step="0.01" type="number" value={plan.billAmount} />
            </label>
            <label className="field-label" htmlFor="tip-percent">
              {t("fields.tipPercent")}
              <input className="input" id="tip-percent" min={0} onChange={(event) => updateNumber("tipPercent", event.target.value)} step="0.1" type="number" value={plan.tipPercent} />
            </label>
            <label className="field-label" htmlFor="tip-people">
              {t("fields.people")}
              <input className="input" id="tip-people" min={1} onChange={(event) => updateNumber("people", event.target.value)} type="number" value={plan.people} />
            </label>
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
              <p className="tool-description">{resultSummary}</p>
            </div>
            <span className="badge local">{result ? t("badges.people", { people: result.people }) : t("badges.tip")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalBill ?? "$0.00"}</strong>
              <span>{t("metrics.totalBill")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedTipAmount ?? "$0.00"}</strong>
              <span>{t("metrics.tipAmount")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedBillAmount ?? "$0.00"}</strong>
              <span>{t("metrics.originalBill")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPerPersonShare ?? "$0.00"}</strong>
              <span>{t("metrics.perPerson")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Receipt size={18} aria-hidden="true" />
            <span>
              <strong>{result ? resultSummary : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {tipNotes.map((item, index) => (
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
