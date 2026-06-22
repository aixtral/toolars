"use client";

import { Brain, Calculator, Save, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  adhdAnswerOptions,
  calculateAdhdScreener,
  defaultAdhdScreenerAnswers,
  type AdhdAnswer,
  type AdhdScreenerResult
} from "@/lib/tools/adhd-screener";

const storageKey = "toolars.adhd-screener.snapshot:v1";

const trustRows = [
  ["Local", "ASRS answers stay in this browser session", "local"],
  ["Screening", "This is not an ADHD diagnosis", "warn"],
  ["Private", "Save stores only this local screener snapshot", ""]
] as const;

const supportNotes = [
  "VitalCalc uses the ASRS-v1.1 6-question screener and counts answers scored 2 or higher.",
  "Four or more positive answers maps to the source screening-positive outcome.",
  "Only a qualified clinician can diagnose ADHD after interview, history, impairment review, and differential assessment."
];

export function AdhdScreenerWorkspace() {
  const t = useTranslations("tools.adhd-screener");
  const [answers, setAnswers] = useState<AdhdAnswer[]>(() => defaultAdhdScreenerAnswers);
  const [result, setResult] = useState<AdhdScreenerResult | null>(null);

  const calculate = () => {
    setResult(calculateAdhdScreener(answers));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
    } catch {}
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? (Number(value) as AdhdAnswer) : answer)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="adhd-screener">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc adult ADHD screening workspace</span>
        <h1>ADHD Adult Screener</h1>
        <p className="subtitle">Score the ASRS-v1.1 six-question adult ADHD screener with local dimensional breakdowns.</p>

        <h2 style={{ marginTop: 28 }}>Local screening model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/adhd-screener/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>ASRS answers</h2>
              <p className="tool-description">Answer based on the last 6 months. Scores of 2 or higher count toward the source positive-answer threshold.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="profile-list">
            {answers.map((_, index) => (
              <label className="profile-row screener-question-row" htmlFor={`adhd-answer-${index}`} key={index}>
                <span>
                  <strong>{t(`questions.${index}.label`)}</strong>
                  <small>{t(`questions.${index}.description`)}</small>
                </span>
                <select aria-label={t(`questions.${index}.label`)} className="input" id={`adhd-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {adhdAnswerOptions.map((answer) => (
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
              <Save size={16} aria-hidden="true" /> Save screener snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Score ASRS
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening result</h2>
              <p className="tool-description">{result ? result.formattedScore : "Run scoring to show ASRS positive-answer count and dimensional scores."}</p>
            </div>
            <span className="badge warn">Screening only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 24"}</strong>
              <span>Total score</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`outcome.${result.outcome}.label`) : "--"}</strong>
              <span>Source outcome</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.positiveCount} / 6` : "0 / 6"}</strong>
              <span>Positive answers</span>
            </article>
            <article className="llm-metric">
              <strong>Screening only</strong>
              <span>Diagnostic status</span>
            </article>
          </div>

          <div className="llm-metric-grid" style={{ marginTop: 14 }}>
            <article className="llm-metric">
              <strong>{result ? `${result.partAScore} / 12` : "0 / 12"}</strong>
              <span>Inattention score</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.partBScore} / 12` : "0 / 12"}</strong>
              <span>Hyperactivity score</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Brain size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`outcome.${result.outcome}.guidance`) : "Waiting for score"}</strong>
              <small>{result ? "Use this as a screening reference and seek professional evaluation when symptoms impair life." : "Score answers first to review ASRS guidance."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Support notes</h2>
        <div className="remediation-list">
          {supportNotes.map((item, index) => (
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
          <p>ASRS output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation.</p>
        </div>
      </aside>
    </div>
  );
}
