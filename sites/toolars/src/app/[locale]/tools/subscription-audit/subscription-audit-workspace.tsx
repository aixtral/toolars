"use client";
import { useTranslations } from "next-intl";

import { Calculator, ReceiptText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
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
  ["Local", "Subscription names, costs, and categories stay in this browser session", "local"],
  ["Review", "Monthly normalization follows the VitalCalc source frequency model", "warn"],
  ["Private", "Save stores only this local subscription list when you choose it", ""]
] as const;

const subscriptionNotes = [
  "VitalCalc monthly cost normalizes yearly, weekly, quarterly, and monthly subscriptions.",
  "Weekly subscriptions use the source 4.33 weeks-per-month conversion.",
  "Review annual renewals and high-share categories before cancelling useful services."
];

const frequencies: Array<{ value: SubscriptionFrequency; label: string }> = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
  { value: "week", label: "Weekly" },
  { value: "quarter", label: "Quarterly" }
];

const categories = Object.entries(categoryLabels) as Array<[SubscriptionCategory, string]>;

export function SubscriptionAuditWorkspace() {
  const t = useTranslations("tools.subscription-audit");
  const [entries, setEntries] = useState<SubscriptionEntry[]>(() => defaultSubscriptionAuditEntries);
  const [result, setResult] = useState<SubscriptionAuditResult | null>(null);

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
        <span className="eyebrow">VitalCalc subscription workspace</span>
        <h1>Subscription Audit Calculator</h1>
        <p className="subtitle">Normalize recurring subscriptions into monthly spend, yearly spend, and category concentration.</p>

        <h2 style={{ marginTop: 28 }}>Local calculation model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/subscription-audit/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Subscription inputs</h2>
              <p className="tool-description">Edit the sample list or use it as a normalized subscription audit.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="profile-list">
            {entries.map((entry, index) => (
              <div className="profile-row" key={`${entry.name}-${index}`} style={{ alignItems: "start" }}>
                <span className="badge">{index + 1}</span>
                <div className="llm-input-grid" style={{ flex: 1 }}>
                  <label className="field-label" htmlFor={`subscription-name-${index}`}>
                    Name
                    <input className="input" id={`subscription-name-${index}`} onChange={(event) => updateEntry(index, { name: event.target.value })} type="text" value={entry.name} />
                  </label>
                  <label className="field-label" htmlFor={`subscription-cost-${index}`}>
                    Cost
                    <input className="input" id={`subscription-cost-${index}`} min={0} onChange={(event) => updateEntry(index, { cost: Number(event.target.value) })} step="0.01" type="number" value={entry.cost} />
                  </label>
                  <label className="field-label" htmlFor={`subscription-frequency-${index}`}>
                    Frequency
                    <select className="input" id={`subscription-frequency-${index}`} onChange={(event) => updateEntry(index, { frequency: event.target.value as SubscriptionFrequency })} value={entry.frequency}>
                      {frequencies.map((frequency) => (
                        <option key={frequency.value} value={frequency.value}>
                          {frequency.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field-label" htmlFor={`subscription-category-${index}`}>
                    Category
                    <select className="input" id={`subscription-category-${index}`} onChange={(event) => updateEntry(index, { category: event.target.value as SubscriptionCategory })} value={entry.category}>
                      {categories.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
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
              <Save size={16} aria-hidden="true" /> Save audit list
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Calculate audit
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Audit summary</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to see normalized subscription spend and concentration."}</p>
            </div>
            <span className="badge local">{result ? "Audit ready" : "Sample"}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedMonthlySpend ?? "$0.00"}</strong>
              <span>Monthly spend</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedYearlySpend ?? "$0.00"}</strong>
              <span>Yearly spend</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedAverageMonthly ?? "$0.00"}</strong>
              <span>Average monthly</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? String(result.subscriptionCount) : String(entries.length)}</strong>
              <span>Subscriptions</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <ReceiptText size={18} aria-hidden="true" />
            <span>
              <strong>{result?.categoryBreakdown[0]?.label ?? "Waiting for calculation"}</strong>
              <small>{result ? "Largest normalized category by monthly spend." : "Calculate first to see category concentration."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Subscription review notes</h2>
        <div className="remediation-list">
          {subscriptionNotes.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>
            <ShieldCheck size={16} aria-hidden="true" /> Local-first
          </strong>
          <p>Subscription audits are browser-only calculations unless you choose Save.</p>
        </div>
      </aside>
    </div>
  );
}
