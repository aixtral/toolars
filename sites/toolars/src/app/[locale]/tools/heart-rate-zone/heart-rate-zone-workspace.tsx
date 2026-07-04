"use client";
import { useLocale, useTranslations } from "next-intl";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateHeartRateZones,
  defaultHeartRateZoneScenario,
  type HeartRateZoneInput,
  type HeartRateZoneResult
} from "@/lib/tools/heart-rate-zone";

const storageKey = "toolars.heart-rate-zone.profile:v1";
const initialResult: HeartRateZoneResult | null = null;

const trustRows = [
  { key: "local", tone: "local" },
  { key: "training", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const measurementNotes = [
  "maxHeartRate",
  "reserve",
  "target"
] as const;

const zoneKeys = [
  "recovery",
  "fatBurn",
  "cardioEndurance",
  "anaerobicThreshold",
  "maximumEffort"
] as const;

function localizedWorkspaceHref(href: string, localeCode: LocaleCode) {
  return localizePath(href, localeCode);
}

function formatCompactNumber(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

export function HeartRateZoneWorkspace() {
  const t = useTranslations("tools.heart-rate-zone.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [profile, setProfile] = useState(defaultHeartRateZoneScenario);
  const [result, setResult] = useState(initialResult);

  const calculate = () => {
    setResult(calculateHeartRateZones(profile));
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {}
  };

  const updateNumber = (key: keyof HeartRateZoneInput, value: string) => {
    setProfile((current) => ({ ...current, [key]: Number(value) }));
    setResult(null);
  };

  function formatBpm(value: number) {
    return t("formats.bpm", { value });
  }

  function formatBpmRange(min: number, max: number) {
    return t("formats.bpmRange", { min, max });
  }

  return (
    <div className="llm-cost-layout" data-tool-workspace="heart-rate-zone">
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
          <a className="button button-outline" href={localizedWorkspaceHref("/tools/heart-rate-zone/about", localeCode)}>
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
            <label className="field-label" htmlFor="heart-zone-age">
              {t("fields.age")}
              <input className="input" id="heart-zone-age" min={0} onChange={(event) => updateNumber("age", event.target.value)} type="number" value={profile.age} />
            </label>
            <label className="field-label" htmlFor="heart-zone-resting">
              {t("fields.restingHeartRate")}
              <input className="input" id="heart-zone-resting" min={0} onChange={(event) => updateNumber("restingHeartRate", event.target.value)} type="number" value={profile.restingHeartRate} />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveProfile} type="button">
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
                      age: formatCompactNumber(Math.max(0, profile.age)),
                      restingHeartRate: formatCompactNumber(Math.max(0, profile.restingHeartRate))
                    })
                  : t("resultSection.emptyDescription")}
              </p>
            </div>
            <span className="badge warn">{t("badges.karvonen")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatBpm(result.maxHeartRate) : formatBpm(0)}</strong>
              <span>{t("metrics.maxHeartRate")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatBpm(result.heartRateReserve) : formatBpm(0)}</strong>
              <span>{t("metrics.heartRateReserve")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.zones[1] ? formatBpmRange(result.zones[1].minBpm, result.zones[1].maxBpm) : "--"}</strong>
              <span>{t("metrics.fatBurn")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.zones[4] ? formatBpmRange(result.zones[4].minBpm, result.zones[4].maxBpm) : "--"}</strong>
              <span>{t("metrics.maximumEffort")}</span>
            </article>
          </div>

          <div className="profile-list" style={{ marginTop: 18 }}>
            {(result?.zones ?? []).map((zone, index) => {
              const zoneKey = zoneKeys[index];
              if (!zoneKey) return null;

              return (
                <div className="profile-row" key={zone.intensityLabel}>
                  <span className="badge">{zone.intensityLabel}</span>
                  <span>
                    <strong>{t(`zones.${zoneKey}.label`)}</strong> - {formatBpmRange(zone.minBpm, zone.maxBpm)}
                    <small style={{ display: "block", marginTop: 2 }}>{t(`zones.${zoneKey}.description`)}</small>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t("recommendation.result") : t("callout.waitingTitle")}</strong>
              <small>{result ? t("callout.resultDescription") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {measurementNotes.map((item, index) => (
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
