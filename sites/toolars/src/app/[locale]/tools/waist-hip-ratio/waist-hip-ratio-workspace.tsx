"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Ruler, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { calculateWaistHipRatio, defaultWaistHipScenario, type WaistHipInput, type WaistHipResult, type WaistHipSex } from "@/lib/tools/waist-hip-ratio";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "reference", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const whrNotes = [
  "formula",
  "measurement",
  "context"
] as const;

export function WaistHipRatioWorkspace() {
  const t = useTranslations("tools.waist-hip-ratio.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [measurements, setMeasurements] = useState((): WaistHipInput => defaultWaistHipScenario);
  const [result, setResult] = useState(() => null as WaistHipResult | null);

  const calculate = () => {
    setResult(calculateWaistHipRatio(measurements));
  };

  const saveMeasurements = () => {
    try {
      window.localStorage.setItem("toolars.waist-hip-ratio.measurements", JSON.stringify(measurements));
    } catch {}
  };

  const updateNumber = (key: keyof Pick<WaistHipInput, "waistCm" | "hipCm">, value: string) => {
    setMeasurements((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  const updateSex = (value: WaistHipSex) => {
    setMeasurements((current) => ({ ...current, sex: value }));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="waist-hip-ratio">
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
          <a className="button button-outline" href={localizedHref("/tools/waist-hip-ratio/about")}>
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
            <label className="field-label" htmlFor="whr-sex">
              {t("fields.sex")}
              <select className="input" id="whr-sex" onChange={(event) => updateSex(event.target.value as WaistHipSex)} value={measurements.sex}>
                <option value="male">{t("sexOptions.male")}</option>
                <option value="female">{t("sexOptions.female")}</option>
              </select>
            </label>
            <label className="field-label" htmlFor="whr-waist">
              {t("fields.waist")}
              <input className="input" id="whr-waist" min={0} onChange={(event) => updateNumber("waistCm", event.target.value)} type="number" value={measurements.waistCm} />
            </label>
            <label className="field-label" htmlFor="whr-hip">
              {t("fields.hip")}
              <input className="input" id="whr-hip" min={0} onChange={(event) => updateNumber("hipCm", event.target.value)} type="number" value={measurements.hipCm} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveMeasurements} type="button">
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
                      sex: t(`sexOptions.${measurements.sex}`),
                      waist: result.formattedWaist,
                      hip: result.formattedHip
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{result ? t(`thresholdLabels.${measurements.sex}`) : t("badges.reference")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRatio ?? "0.00"}</strong>
              <span>{t("metrics.ratio")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`riskCategories.${getRiskCategoryKey(result.category)}`) : t("resultSection.pending")}</strong>
              <span>{t("metrics.category")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedWaist ?? "0 cm"}</strong>
              <span>{t("metrics.waist")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedHip ?? "0 cm"}</strong>
              <span>{t("metrics.hip")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Ruler size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`tips.${getRiskCategoryKey(result.category)}`) : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.calculatedDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {whrNotes.map((item, index) => (
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

function getRiskCategoryKey(category: string) {
  if (category === "Low Risk") return "low";
  if (category === "Moderate Risk") return "moderate";
  return "high";
}
