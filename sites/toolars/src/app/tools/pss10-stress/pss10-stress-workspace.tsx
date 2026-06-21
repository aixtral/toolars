"use client";

import { Activity, Calculator, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculatePss10Stress,
  defaultPss10Answers,
  pss10AnswerLabels,
  pss10AnswerOptions,
  pss10Questions,
  type Pss10Answer,
  type Pss10Result
} from "@/lib/tools/pss10-stress";

const storageKey = "toolars.pss10-stress.snapshot:v1";

const trustRows = [
  ["Local", "PSS-10 answers stay in this browser session", "local"],
  ["Screening", "This is not a diagnosis or crisis service", "warn"],
  ["Private", "Save stores only this local stress snapshot", ""]
] as const;

const supportNotes = [
  "VitalCalc maps PSS-10 totals to low, moderate, and high perceived stress bands.",
  "Items 4, 5, 7, 9, and 10 are reverse scored before the total is calculated.",
  "Sustained stress, sleep disruption, panic, or safety concerns should be reviewed with a qualified clinician."
];

export function Pss10StressWorkspace() {
  const [answers, setAnswers] = useState<Pss10Answer[]>(() => defaultPss10Answers);
  const [result, setResult] = useState<Pss10Result | null>(null);

  const calculate = () => {
    setResult(calculatePss10Stress(answers));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
    } catch {}
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? (Number(value) as Pss10Answer) : answer)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="pss10-stress">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc perceived stress workspace</span>
        <h1>PSS-10 Stress Screening</h1>
        <p className="subtitle">Score ten perceived-stress questions locally with source reverse scoring.</p>

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
          <a className="button button-outline" href="/tools/pss10-stress/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening answers</h2>
              <p className="tool-description">Answer based on the last month. Reverse-scored items are handled by the local scoring model.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="profile-list">
            {pss10Questions.map((question, index) => (
              <label className="profile-row screener-question-row" htmlFor={`pss10-answer-${index}`} key={question.label}>
                <span>
                  <strong>{question.label}</strong>
                  <small>{question.description}</small>
                </span>
                <select aria-label={question.label} className="input" id={`pss10-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {pss10AnswerOptions.map((answer) => (
                    <option key={answer} value={answer}>
                      {pss10AnswerLabels[answer]}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
              <Save size={16} aria-hidden="true" /> Save stress snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Score PSS-10
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Stress result</h2>
              <p className="tool-description">{result ? result.summary : "Run scoring to show PSS-10 total and perceived-stress band."}</p>
            </div>
            <span className="badge warn">Screening only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 40"}</strong>
              <span>PSS-10 score</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.severity ?? "--"}</strong>
              <span>Stress band</span>
            </article>
            <article className="llm-metric">
              <strong>4, 5, 7, 9, 10</strong>
              <span>Reverse items</span>
            </article>
            <article className="llm-metric">
              <strong>Screening only</strong>
              <span>Diagnostic status</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Activity size={18} aria-hidden="true" />
            <span>
              <strong>{result?.guidance ?? "Waiting for score"}</strong>
              <small>{result ? "Use this as a perceived-stress reference and seek help when stress affects daily functioning." : "Score answers first to review stress guidance."}</small>
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
          <p>PSS-10 output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation.</p>
        </div>
      </aside>
    </div>
  );
}
