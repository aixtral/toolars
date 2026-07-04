"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateBillSplit,
  defaultBillSplitScenario,
  type BillSplitInput,
  type BillSplitResult,
  type BillSplitMode
} from "@/lib/tools/bill-split-calculator";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "agreement", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const splitNotes = ["total", "equal", "itemized"] as const;

export function BillSplitCalculatorWorkspace() {
  const t = useTranslations("tools.bill-split-calculator.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [plan, setPlan] = useState((): BillSplitInput => ({ ...defaultBillSplitScenario }));
  const [result, setResult] = useState(null as BillSplitResult | null);

  const calculate = () => {
    setResult(calculateBillSplit(plan));
  };

  const savePlan = () => {
    window.localStorage.setItem("toolars.bill-split-calculator.plan", JSON.stringify(plan));
  };

  const updateNumber = (key: keyof Omit<BillSplitInput, "splitMode">, value: string) => {
    setPlan((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateMode = (value: string) => {
    setPlan((current) => ({ ...current, splitMode: value as BillSplitMode }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="bill-split-calculator">
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
          <a className="button button-outline" href={localizedHref("/tools/bill-split-calculator/about")}>
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
            <label className="field-label" htmlFor="split-subtotal">
              {t("fields.subtotal")}
              <input className="input" id="split-subtotal" min={0} onChange={(event) => updateNumber("subtotal", event.target.value)} step="0.01" type="number" value={plan.subtotal} />
            </label>
            <label className="field-label" htmlFor="split-people">
              {t("fields.people")}
              <input className="input" id="split-people" min={1} onChange={(event) => updateNumber("people", event.target.value)} type="number" value={plan.people} />
            </label>
            <label className="field-label" htmlFor="split-tip">
              {t("fields.tipPercent")}
              <input className="input" id="split-tip" min={0} onChange={(event) => updateNumber("tipPercent", event.target.value)} step="0.1" type="number" value={plan.tipPercent} />
            </label>
            <label className="field-label" htmlFor="split-tax">
              {t("fields.taxPercent")}
              <input className="input" id="split-tax" min={0} onChange={(event) => updateNumber("taxPercent", event.target.value)} step="0.01" type="number" value={plan.taxPercent} />
            </label>
            <label className="field-label" htmlFor="split-mode">
              {t("fields.splitMode")}
              <select className="input" id="split-mode" onChange={(event) => updateMode(event.target.value)} value={plan.splitMode}>
                <option value="equal">{t("fields.equal")}</option>
                <option value="itemized">{t("fields.itemized")}</option>
              </select>
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
            <span className="badge local">{result ? t(`splitModes.${result.splitMode}`) : t("badges.split")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedGrandTotal ?? "$0.00"}</strong>
              <span>{t("metrics.grandTotal")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEqualShare ?? "$0.00"}</strong>
              <span>{t("metrics.equalShare")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFees ?? "$0.00"}</strong>
              <span>{t("metrics.fees")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedSubtotal ?? "$0.00"}</strong>
              <span>{t("metrics.subtotal")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.summary ?? t("callout.waitingTitle")}</strong>
              <small>{result?.guidance ?? t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {splitNotes.map((item, index) => (
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
