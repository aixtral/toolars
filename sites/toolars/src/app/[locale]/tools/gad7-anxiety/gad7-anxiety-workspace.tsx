"use client";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateGad7Anxiety,
  defaultGad7Answers,
  gad7AnswerOptions,
  type Gad7Answer,
  type Gad7Result
} from "@/lib/tools/gad7-anxiety";

const storageKey = "toolars.gad7-anxiety.snapshot:v1";

const trustRows = [
  { key: "local", tone: "local" },
  { key: "screening", tone: "warn" },
  { key: "private", tone: "" }
] as const;

const supportNotes = [
  "scoring",
  "clinician",
  "crisis"
] as const;

export function Gad7AnxietyWorkspace() {
  const t = useTranslations("tools.gad7-anxiety.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [answers, setAnswers] = useState((): Gad7Answer[] => defaultGad7Answers);
  const [result, setResult] = useState(null as Gad7Result | null);

  const calculate = () => {
    setResult(calculateGad7Anxiety(answers));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
    } catch {}
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? Number(value) as Gad7Answer : answer)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="gad7-anxiety">
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
          <a className="button button-outline" href={localizedHref("/tools/gad7-anxiety/about")}>
            {t("detailsLink")}
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("answerSection.title")}</h2>
              <p className="tool-description">{t("answerSection.description")}</p>
            </div>
            <span className="badge local">{t("badges.local")}</span>
          </div>

          <div className="profile-list">
            {answers.map((_, index) => (
              <label className="profile-row gad7-question-row" htmlFor={`gad7-answer-${index}`} key={index}>
                <span>
                  <strong>{t(`questions.${index}.label`)}</strong>
                  <small>{t(`questions.${index}.description`)}</small>
                </span>
                <select aria-label={t(`questions.${index}.label`)} className="input" id={`gad7-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {gad7AnswerOptions.map((answer) => (
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
              <Calculator size={16} aria-hidden="true" /> {t("actions.score")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultSection.title")}</h2>
              <p className="tool-description">{result ? result.formattedScore : t("resultSection.emptyDescription")}</p>
            </div>
            <span className="badge warn">{t("badges.screeningOnly")}</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? t("resultSection.emptyScore")}</strong>
              <span>{t("metrics.totalScore")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`severity.${result.severity}.label`) : "--"}</strong>
              <span>{t("metrics.severityBand")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`severity.${result.severity}.label`) : "--"}</strong>
              <span>{t("metrics.supportLevel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{t("badges.screeningOnly")}</strong>
              <span>{t("metrics.diagnosticStatus")}</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
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
