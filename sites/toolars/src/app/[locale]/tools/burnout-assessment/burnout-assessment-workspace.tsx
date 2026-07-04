"use client";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  burnoutAnswerOptions,
  calculateBurnoutAssessment,
  defaultBurnoutAnswers,
  type BurnoutAnswer,
  type BurnoutResult
} from "@/lib/tools/burnout-assessment";

const storageKey = "toolars.burnout-assessment.snapshot:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "screening", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const supportNotes = [
  "bands",
  "dimensions",
  "clinician"
] as const;

export function BurnoutAssessmentWorkspace() {
  const t = useTranslations("tools.burnout-assessment.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const detailsHref = localizePath("/tools/burnout-assessment/about", localeCode);
  const [answers, setAnswers] = useState(() => defaultBurnoutAnswers);
  const [result, setResult] = useState(null as BurnoutResult | null);

  const calculate = () => {
    setResult(calculateBurnoutAssessment(answers));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
    } catch {}
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? (Number(value) as BurnoutAnswer) : answer)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="burnout-assessment">
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

          <div className="profile-list">
            {answers.map((_, index) => (
              <label className="profile-row screener-question-row" htmlFor={`burnout-answer-${index}`} key={index}>
                <span>
                  <strong>{t(`questions.${index}.label`)}</strong>
                  <small>{t(`questions.${index}.description`)}</small>
                </span>
                <select aria-label={t(`questions.${index}.label`)} className="input" id={`burnout-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {burnoutAnswerOptions.map((answer) => (
                    <option key={answer} value={answer}>
                      {t(`answerLabels.${answer}`)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
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
              <p className="tool-description">{result ? result.formattedScore : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.screening")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 40"}</strong>
              <span>{t("metrics.totalScore")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`severity.${result.severity}.label`) : "--"}</strong>
              <span>{t("metrics.burnoutBand")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedExhaustionScore ?? "0 / 24"}</strong>
              <span>{t("metrics.exhaustion")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDetachmentScore ?? "0 / 16"}</strong>
              <span>{t("metrics.detachment")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`severity.${result.severity}.guidance`) : t("resultSection.waitingTitle")}</strong>
              <small>{result ? t("resultSection.guidanceDescription") : t("resultSection.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {supportNotes.map((item, index) => (
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
