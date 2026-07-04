"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Save, ShieldCheck, Wine } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateAlcoholMetabolism,
  defaultAlcoholMetabolismScenario,
  type AlcoholDrinkType,
  type AlcoholMetabolismInput,
  type AlcoholSex,
  type AlcoholStomachState
} from "@/lib/tools/alcohol-metabolism";

const storageKey = "toolars.alcohol-metabolism.scenario:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "safety", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const safetyNotes = ["model", "variability", "legal"] as const;
const sexOptions = ["male", "female"] as const;
const drinkOptions = ["beer", "wine", "spirits", "cocktail"] as const;
const stomachOptions = ["ate", "empty"] as const;

export function AlcoholMetabolismWorkspace() {
  const t = useTranslations("tools.alcohol-metabolism.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/alcohol-metabolism/about", localeCode);
  const [values, setValues] = useState(defaultAlcoholMetabolismScenario);
  const [result, setResult] = useState<ReturnType<typeof calculateAlcoholMetabolism> | null>(null);
  const statusKey = getAlcoholStatusKey(result);

  const calculate = () => {
    setResult(calculateAlcoholMetabolism(values));
  };

  const saveValues = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<AlcoholMetabolismInput, "weightKg" | "quantity" | "durationHours">, value: string) => {
    setValues((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="alcohol-metabolism">
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
            <label className="field-label" htmlFor="alcohol-sex">
              {t("fields.sex")}
              <select className="input" id="alcohol-sex" onChange={(event) => setValues((current) => ({ ...current, sex: event.target.value as AlcoholSex }))} value={values.sex}>
                {sexOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.sex.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="alcohol-weight">
              {t("fields.weightKg")}
              <input className="input" id="alcohol-weight" min={0} onChange={(event) => updateNumber("weightKg", event.target.value)} step="0.1" type="number" value={values.weightKg} />
            </label>
            <label className="field-label" htmlFor="alcohol-drink">
              {t("fields.drinkType")}
              <select className="input" id="alcohol-drink" onChange={(event) => setValues((current) => ({ ...current, drinkType: event.target.value as AlcoholDrinkType }))} value={values.drinkType}>
                {drinkOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.drinkType.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="alcohol-quantity">
              {t("fields.quantity")}
              <input className="input" id="alcohol-quantity" min={0} onChange={(event) => updateNumber("quantity", event.target.value)} step="0.5" type="number" value={values.quantity} />
            </label>
            <label className="field-label" htmlFor="alcohol-duration">
              {t("fields.durationHours")}
              <input className="input" id="alcohol-duration" min={0} onChange={(event) => updateNumber("durationHours", event.target.value)} step="0.5" type="number" value={values.durationHours} />
            </label>
            <label className="field-label" htmlFor="alcohol-stomach">
              {t("fields.stomach")}
              <select className="input" id="alcohol-stomach" onChange={(event) => setValues((current) => ({ ...current, stomach: event.target.value as AlcoholStomachState }))} value={values.stomach}>
                {stomachOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.stomach.${option}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveValues} type="button">
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
                  ? t("resultSection.calculatedDescription", { bac: result.formattedBac, status: t(`statuses.${statusKey}`) })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result ? t(`statuses.${statusKey}`) : t("badges.safety")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedBac ?? t("metrics.emptyBac")}</strong>
              <span>{t("metrics.estimatedBac")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedPureAlcohol ?? t("metrics.emptyGrams")}</strong>
              <span>{t("metrics.pureAlcohol")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("values.hours", { count: result.timeTo002Hours.toLocaleString() }) : t("metrics.emptyHours")}</strong>
              <span>{t("metrics.timeTo002")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t("values.hours", { count: result.timeToZeroHours.toLocaleString() }) : t("metrics.emptyHours")}</strong>
              <span>{t("metrics.fullySober")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Wine size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`statuses.${statusKey}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {safetyNotes.map((item, index) => (
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

function getAlcoholStatusKey(result: ReturnType<typeof calculateAlcoholMetabolism> | null) {
  if (!result) return "safety";
  if (result.bac === 0) return "fullyMetabolized";
  if (result.bac <= 0.02) return "belowChinaDui";
  if (result.bac <= 0.05) return "aboveChinaDui";
  if (result.bac <= 0.08) return "aboveMostCountriesDui";
  return "severelyImpaired";
}
