"use client";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculatePhq9Depression,
  defaultPhq9Answers,
  phq9AnswerLabels,
  phq9AnswerOptions,
  phq9Questions,
  type Phq9Answer,
  type Phq9Result
} from "@/lib/tools/phq9-depression";

const storageKey = "toolars.phq9-depression.snapshot:v1";

const trustRows = [
  ["Local", "PHQ-9 answers stay in this browser session", "local"],
  ["Screening", "This is not a diagnosis or crisis service", "warn"],
  ["Private", "Save stores only this local screening snapshot", ""]
] as const;

const supportNotes = [
  "VitalCalc maps PHQ-9 totals to minimal, mild, moderate, moderately severe, and severe depression bands.",
  "A non-zero item 9 answer should be treated as urgent and reviewed with crisis, emergency, or qualified clinical support.",
  "Persistent symptoms, impairment, medication questions, or safety concerns should be reviewed with a qualified clinician."
];

export function Phq9DepressionWorkspace() {
  const [answers, setAnswers] = useState<Phq9Answer[]>(() => defaultPhq9Answers);
  const [result, setResult] = useState<Phq9Result | null>(null);

  const calculate = () => {
    setResult(calculatePhq9Depression(answers));
  };

  const saveSnapshot = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
    } catch {}
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? (Number(value) as Phq9Answer) : answer)));
    setResult(null);
  };

  return (
    <div className="llm-cost-layout" data-tool-workspace="phq9-depression">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">VitalCalc depression screening workspace</span>
        <h1>PHQ-9 Depression Screening</h1>
        <p className="subtitle">Score nine PHQ-9 frequency questions locally and surface item 9 safety guidance.</p>

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
          <a className="button button-outline" href="/tools/phq9-depression/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening answers</h2>
              <p className="tool-description">Answer based on the last 2 weeks. Item 9 is treated as a safety flag when non-zero.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="profile-list">
            {phq9Questions.map((question, index) => (
              <label className="profile-row screener-question-row" htmlFor={`phq9-answer-${index}`} key={question.label}>
                <span>
                  <strong>{question.label}</strong>
                  <small>{question.description}</small>
                </span>
                <select aria-label={question.label} className="input" id={`phq9-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {phq9AnswerOptions.map((answer) => (
                    <option key={answer} value={answer}>
                      {phq9AnswerLabels[answer]}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="button button-outline" onClick={saveSnapshot} type="button">
              <Save size={16} aria-hidden="true" /> Save screening snapshot
            </button>
            <button className="button button-solid" onClick={calculate} type="button">
              <Calculator size={16} aria-hidden="true" /> Score PHQ-9
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening result</h2>
              <p className="tool-description">{result ? result.summary : "Run scoring to show PHQ-9 total, severity band, and item 9 status."}</p>
            </div>
            <span className="badge warn">Screening only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 27"}</strong>
              <span>PHQ-9 score</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.severity ?? "--"}</strong>
              <span>Severity band</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.hasSelfHarmRisk ? "Flagged" : "No flag"}</strong>
              <span>Item 9 status</span>
            </article>
            <article className="llm-metric">
              <strong>Screening only</strong>
              <span>Diagnostic status</span>
            </article>
          </div>

          <div className="llm-plan-callout">
            <Heart size={18} aria-hidden="true" />
            <span>
              <strong>{result?.guidance ?? "Waiting for score"}</strong>
              <small>{result ? result.crisisNote : "Score answers first to review PHQ-9 support guidance."}</small>
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
          <p>PHQ-9 output is a screening reference, not a diagnosis, emergency service, or substitute for professional evaluation.</p>
        </div>
      </aside>
    </div>
  );
}
