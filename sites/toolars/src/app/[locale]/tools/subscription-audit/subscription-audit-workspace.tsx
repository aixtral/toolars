"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateSubscriptionAudit,
  categoryLabels,
  defaultSubscriptionAuditEntries,
  type SubscriptionCategory,
  type SubscriptionEntry,
  type SubscriptionFrequency,
  type SubscriptionAuditResult
} from "@/lib/tools/subscription-audit";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "review", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const subscriptionNotes = [
  "normalized",
  "weekly",
  "renewals"
] as const;

const frequencies: SubscriptionFrequency[] = ["month", "year", "week", "quarter"];

const categories = Object.keys(categoryLabels) as SubscriptionCategory[];

export function SubscriptionAuditWorkspace() {
  const t = useTranslations("tools.subscription-audit.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [entries, setEntries] = useState((): SubscriptionEntry[] => defaultSubscriptionAuditEntries);
  const [result, setResult] = useState((): SubscriptionAuditResult | null => null);

  const calculate = () => {
    setResult(calculateSubscriptionAudit(entries));
  };

  const saveEntries = () => {
    try {
      window.localStorage.setItem("toolars.subscription-audit.entries", JSON.stringify(entries));
    } catch {}
  };

  const updateEntry = (index: number, update: Partial<SubscriptionEntry>) => {
    setEntries((current) => current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...update } : entry)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="subscription-audit">
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
          <a className="button button-outline" href={localizedHref("/tools/subscription-audit/about")}>
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

          <div className="profile-list">
            {entries.map((entry, index) => (
              <div className="profile-row" key={`${entry.name}-${index}`} style={{ alignItems: "start" }}>
                <span className="badge">{index + 1}</span>
                <div className="llm-input-grid" style={{ flex: 1 }}>
                  <label className="field-label" htmlFor={`subscription-name-${index}`}>
                    {t("fields.name")}
                    <input className="input" id={`subscription-name-${index}`} onChange={(event) => updateEntry(index, { name: event.target.value })} type="text" value={entry.name} />
                  </label>
                  <label className="field-label" htmlFor={`subscription-cost-${index}`}>
                    {t("fields.cost")}
                    <input className="input" id={`subscription-cost-${index}`} min={0} onChange={(event) => updateEntry(index, { cost: Number(event.target.value) })} step="0.01" type="number" value={entry.cost} />
                  </label>
                  <label className="field-label" htmlFor={`subscription-frequency-${index}`}>
                    {t("fields.frequency")}
                    <select className="input" id={`subscription-frequency-${index}`} onChange={(event) => updateEntry(index, { frequency: event.target.value as SubscriptionFrequency })} value={entry.frequency}>
                      {frequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {t(`frequencyOptions.${frequency}`)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field-label" htmlFor={`subscription-category-${index}`}>
                    {t("fields.category")}
                    <select className="input" id={`subscription-category-${index}`} onChange={(event) => updateEntry(index, { category: event.target.value as SubscriptionCategory })} value={entry.category}>
                      {categories.map((value) => (
                        <option key={value} value={value}>
                          {t(`categoryOptions.${value}`)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveEntries} type="button">
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
                      count: result.subscriptionCount,
                      monthly: result.formattedMonthlySpend
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge local">{result ? t("badges.auditReady") : t("badges.sample")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySpend ?? "$0.00"}</strong>
              <span>{t("metrics.monthlySpend")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedYearlySpend ?? "$0.00"}</strong>
              <span>{t("metrics.yearlySpend")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverageMonthly ?? "$0.00"}</strong>
              <span>{t("metrics.averageMonthly")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.subscriptionCount) : String(entries.length)}</strong>
              <span>{t("metrics.subscriptions")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.categoryBreakdown[0] ? t(`categoryOptions.${result.categoryBreakdown[0].category}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {subscriptionNotes.map((item, index) => (
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
