"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateLeanBodyMass, defaultLeanBodyMassScenario, type LeanBodyMassInput, type LeanBodyMassResult } from "@/lib/tools/lean-body-mass";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const compositionNotes = [
  "formula",
  "method",
  "measurement"
] as const;

export function LeanBodyMassWorkspace() {
  const t = useTranslations("tools.lean-body-mass.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const [composition, setComposition] = useState(defaultLeanBodyMassScenario);
  const [result, setResult] = useState<LeanBodyMassResult | null>(null);

  const calculate = () => {
    setResult(calculateLeanBodyMass(composition));
  };

  const saveComposition = () => {
    window.localStorage.setItem("toolars.lean-body-mass.composition", JSON.stringify(composition));
  };

  const updateNumber = (key: keyof LeanBodyMassInput, value: string) => {
    setComposition((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="lean-body-mass">
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
          <a className="button button-outline" href={localizedHref("/tools/lean-body-mass/about")}>
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
            <label className="field-label" htmlFor="lean-weight">
              {t("fields.weight")}
              <input className="input" id="lean-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} type="number" value={composition.weightKg} />
            </label>
            <label className="field-label" htmlFor="lean-body-fat">
              {t("fields.bodyFat")}
              <input className="input" id="lean-body-fat" min={0} onChange={(event) => updateNumber("bodyFatPercent", event.target.value)} step="0.1" type="number" value={composition.bodyFatPercent} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveComposition} type="button">
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
                      bodyFat: formatOneDecimal(Math.max(0, Math.min(100, composition.bodyFatPercent)), localeCode),
                      weight: formatInteger(Math.max(0, composition.weightKg), localeCode)
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedLeanBodyMass ?? "0.0 kg"}</strong>
              <span>{t("metrics.leanBodyMass")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedFatMass ?? "0.0 kg"}</strong>
              <span>{t("metrics.fatMass")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedLeanMassRatio ?? "0.0%"}</strong>
              <span>{t("metrics.leanMassRatio")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Scale size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.result") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.trendDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {compositionNotes.map((item, index) => (
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

function formatInteger(value: number, locale: LocaleCode): string {
  return Math.round(value).toLocaleString(locale);
}

function formatOneDecimal(value: number, locale: LocaleCode): string {
  return value.toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
}
