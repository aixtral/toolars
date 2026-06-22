"use client";

import { Calculator, Flame, Save, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  burnoutAnswerOptions,
  calculateBurnoutAssessment,
  defaultBurnoutAnswers,
  type BurnoutAnswer,
  type BurnoutResult
} from "@/lib/tools/burnout-assessment";

const storageKey = "toolars.burnout-assessment.snapshot:v1";

const trustRows = [
  ["Local", "Burnout answers stay in this browser session", "local"],
  ["Screening", "This is not a mental-health diagnosis", "warn"],
  ["Private", "Save stores only this local assessment snapshot", ""]
] as const;

const supportNotes = [
  "VitalCalc maps burnout totals to no significant, mild, moderate, and severe burnout bands.",
  "The first 6 items form the exhaustion dimension; the last 4 form the detachment dimension.",
  "Sustained burnout, depression, anxiety, or safety concerns should be reviewed with a qualified clinician."
];

export function BurnoutAssessmentWorkspace() {
  const t = useTranslations("tools.burnout-assessment");
  const [answers, setAnswers] = useState<BurnoutAnswer[]>(() => defaultBurnoutAnswers);
  const [result, setResult] = useState<BurnoutResult | null>(null);

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
        <span className="eyebrow">VitalCalc burnout screening workspace</span>
        <h1>Burnout Assessment</h1>
        <p className="subtitle">Score a 10-item work-state screener with exhaustion and detachment breakdowns.</p>

        <h2 style={{ marginTop: 28 }}>Local assessment model</h2>
        <div className="profile-list">
          {trustRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/burnout-assessment/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Work-state answers</h2>
              <p className="tool-description">Answer based on the last month. The first 6 items score exhaustion and the last 4 score detachment.</p>
            </div>
            <span className="badge local">Local</span>
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
              <Save size={16} aria-hidden="true" /> Save burnout snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Score burnout
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Assessment result</h2>
              <p className="tool-description">{result ? result.formattedScore : "Run scoring to show burnout total, exhaustion, and detachment scores."}</p>
            </div>
            <span className="badge warn">Screening only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 40"}</strong>
              <span>Total score</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`severity.${result.severity}.label`) : "--"}</strong>
              <span>Burnout band</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedExhaustionScore ?? "0 / 24"}</strong>
              <span>Exhaustion</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedDetachmentScore ?? "0 / 16"}</strong>
              <span>Detachment</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Flame size={18} aria-hidden="true" />
            <span>
              <strong>{result ? t(`severity.${result.severity}.guidance`) : "Waiting for score"}</strong>
              <small>{result ? "Use this as a work-health screening reference and seek professional help when symptoms persist." : "Score answers first to review burnout guidance."}</small>
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
          <p>Burnout output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation.</p>
        </div>
      </aside>
    </div>
  );
}
