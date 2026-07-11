"use client";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import { ClipboardCheck, FileWarning, Save, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { scanPromptInjection, type PromptInjectionScanResult } from "@/lib/tools/prompt-injection-scanner";

const profileRows = [
  { key: "local", tone: "local" },
  { key: "ai", tone: "local" },
  { key: "team", tone: "" }
] as const;

const reviewNotes = [
  "separate",
  "secrets",
  "callbacks"
] as const;

const patternTypes = [
  "ignore_instructions",
  "role_override",
  "system_prompt_leak",
  "context_escape",
  "jailbreak_attempt",
  "data_exposure"
] as const;

type PatternType = (typeof patternTypes)[number];

export function PromptInjectionScannerWorkspace() {
  const t = useTranslations("tools.prompt-injection-scanner.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [prompt, setPrompt] = useState(() => t("samplePrompt"));
  const [result, setResult] = useState(null as PromptInjectionScanResult | null);

  const scan = () => {
    setResult(scanPromptInjection(prompt));
  };

  const saveDraft = () => {
    window.localStorage.setItem("toolars.prompt-injection-scanner.draft", prompt);
  };

  const getPatternLabel = (type: string, fallback: string) => {
    return isPatternType(type) ? t(`patterns.${type}.label`) : fallback;
  };

  const getPatternDescription = (type: string, fallback: string) => {
    return isPatternType(type) ? t(`patterns.${type}.description`) : fallback;
  };

  const getRecommendation = (type: string, fallback: string) => {
    return isPatternType(type) ? t(`recommendations.${type}`) : fallback;
  };

  const riskLabel = result ? t(`riskLevels.${result.riskLevel}`) : t("badges.notScanned");
  const scanStatusLabel = result ? t("badges.scanned") : t("badges.notScanned");
  const resultSummary = result
    ? formatResultSummary(
        result,
        getPatternLabel,
        (level) => t(`riskNames.${level}`),
        () => t("resultSection.summary.noContent"),
        () => t("resultSection.summary.safe"),
        (risk, patterns) => t("resultSection.summary.detected", { risk, patterns })
      )
    : "";
  const remediationItems = result
    ? getResultRecommendations(result, getRecommendation, t("recommendations.safe")).slice(0, 3)
    : reviewNotes.map((item) => t(`review.notes.${item}`));

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("shell.reportReady") : t("shell.waiting")}
      providerRoute={result ? t("shell.localFindings") : t("shell.consentGated")}
      runMode={t("shell.runMode")}
      toolSlug="prompt-injection-scanner"
    >
      <section className="workspace-panel prompt-overview-panel" data-prompt-mobile-density="title-single-line-v2">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("profileTitle")}</h2>
        <div className="profile-list">
          {profileRows.map(({ key, tone }) => (
            <div className="profile-row" key={key}>
              <span className={`badge ${tone}`}>{t(`trustRows.${key}.label`)}</span>
              <span>{t(`trustRows.${key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <button disabled className="button button-outline" type="button">{t("actions.deepReview")}</button>
          <a className="button button-outline" href={localizedHref("/tools/prompt-injection-scanner/about")}>{t("actions.details")}</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputSection.title")}</h2>
              <p className="tool-description">{t("inputSection.description")}</p>
            </div>
            <span className={`badge ${result ? riskTone(result.riskLevel) : "ai"}`}>{scanStatusLabel}</span>
          </div>

          <label className="field-label" htmlFor="prompt-surface">{t("fields.promptContent")}</label>
          <textarea
            aria-label={t("fields.promptContent")}
            className="textarea prompt-textarea"
            id="prompt-surface"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveDraft}>
              <Save size={16} aria-hidden="true" /> {t("actions.saveDraft")}
            </button>
            <button className="button button-solid" type="button" onClick={scan}>
              <ShieldAlert size={16} aria-hidden="true" /> {t("actions.scan")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultSection.title")}</h2>
              <p className="tool-description">{result ? t("resultSection.readyDescription") : t("resultSection.emptyDescription")}</p>
            </div>
            <button disabled className="button button-outline" type="button">{t("actions.exportReport")}</button>
          </div>

          <div className="risk-meter" aria-label={t("metrics.riskScore")}>
            <span style={{ width: `${result?.riskScore ?? 10}%` }} />
          </div>

          {result ? (
            <div className="risk-report-card">
              <span className={`risk-score ${riskTone(result.riskLevel)}`}>{result.riskScore}</span>
              <div>
                <h3>{riskLabel}</h3>
                <p className="tool-description">{resultSummary}</p>
              </div>
            </div>
          ) : (
            <div className="risk-report-card">
              <span className="risk-score idle">--</span>
              <div>
                <h3>{t("resultSection.waitingTitle")}</h3>
                <p className="tool-description">{t("resultSection.waitingDescription")}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="finding-list">
              {result.patterns.length === 0 ? (
                <div className="finding-row safe">
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>{t("resultSection.noPatterns")}</span>
                </div>
              ) : (
                result.patterns.map((pattern) => (
                  <div className="finding-row" key={`${pattern.type}-${pattern.match}`}>
                    <FileWarning size={18} aria-hidden="true" />
                    <span>
                      <strong>{getPatternLabel(pattern.type, pattern.label)}</strong>
                      <small>{getPatternDescription(pattern.type, pattern.description)}</small>
                      <code>{pattern.match}</code>
                    </span>
                    <span className={`badge ${riskTone(pattern.severity)}`}>{t(`severity.${pattern.severity}`)}</span>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <p className="subtitle">{t("review.subtitle")}</p>

        <div className="remediation-list">
          {remediationItems.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="button-row">
          <button disabled className="button button-outline" type="button">{t("actions.saveToLab")}</button>
          <button disabled className="button button-solid" type="button">
            <ClipboardCheck size={16} aria-hidden="true" /> {t("actions.createChecklist")}
          </button>
        </div>

        <div className="consent-box">
          <strong>
            <Sparkles size={16} aria-hidden="true" /> {t("callout.title")}
          </strong>
          <p>{t("callout.body")}</p>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function riskTone(level: string): string {
  if (level === "critical" || level === "high") return "ai";
  if (level === "medium") return "";
  return "local";
}

function isPatternType(value: string): value is PatternType {
  return patternTypes.includes(value as PatternType);
}

function getResultRecommendations(
  result: PromptInjectionScanResult,
  getRecommendation: (type: string, fallback: string) => string,
  safeRecommendation: string
): string[] {
  if (result.patterns.length === 0) return [safeRecommendation];

  return Array.from(
    new Set(result.patterns.map((pattern) => getRecommendation(pattern.type, pattern.mitigation)))
  );
}

function formatResultSummary(
  result: PromptInjectionScanResult,
  getPatternLabel: (type: string, fallback: string) => string,
  getRiskName: (level: PromptInjectionScanResult["riskLevel"]) => string,
  getNoContentSummary: () => string,
  getSafeSummary: () => string,
  getDetectedSummary: (risk: string, patterns: string) => string
): string {
  if (result.summary === "No prompt content provided.") return getNoContentSummary();
  if (result.patterns.length === 0) return getSafeSummary();

  const patternLabels = Array.from(
    new Set(result.patterns.map((pattern) => getPatternLabel(pattern.type, pattern.label)))
  );

  return getDetectedSummary(getRiskName(result.riskLevel), patternLabels.join(", "));
}
