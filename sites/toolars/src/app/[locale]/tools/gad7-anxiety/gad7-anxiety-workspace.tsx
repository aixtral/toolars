"use client";

import { Calculator, Heart, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  calculateGad7Anxiety,
  defaultGad7Answers,
  gad7AnswerLabels,
  gad7Questions,
  type Gad7Answer,
  type Gad7Result
} from "@/lib/tools/gad7-anxiety";

const storageKey = "toolars.gad7-anxiety.snapshot:v1";

const trustRows = [
  ["Local", "GAD-7 answers stay in this browser session", "local"],
  ["Screening", "This is not a diagnosis or crisis service", "warn"],
  ["Private", "Save stores only this local screening snapshot", ""]
] as const;

const supportNotes = [
  "VitalCalc maps GAD-7 totals to minimal, mild, moderate, and severe anxiety bands.",
  "Persistent symptoms, impairment, panic, substance use, or physical symptoms should be reviewed with a clinician.",
  "If you feel at immediate risk or unsafe, contact local emergency or crisis support now."
];

export function Gad7AnxietyWorkspace() {
  const [answers, setAnswers] = useState<Gad7Answer[]>(() => defaultGad7Answers);
  const [result, setResult] = useState<Gad7Result | null>(null);

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
        <span className="eyebrow">VitalCalc anxiety screening workspace</span>
        <h1>GAD-7 Anxiety Screening</h1>
        <p className="subtitle">Score seven anxiety-frequency questions locally and review screening-only support guidance.</p>

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
          <a className="button button-outline" href="/tools/gad7-anxiety/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening answers</h2>
              <p className="tool-description">Answer based on the last 2 weeks. Values mirror the source GAD-7 0-3 frequency scale.</p>
            </div>
            <span className="badge local">Local</span>
          </div>

          <div className="profile-list">
            {gad7Questions.map((question, index) => (
              <label className="profile-row gad7-question-row" htmlFor={`gad7-answer-${index}`} key={question.label}>
                <span>
                  <strong>{question.label}</strong>
                  <small>{question.description}</small>
                </span>
                <select aria-label={question.label} className="input" id={`gad7-answer-${index}`} onChange={(event) => updateAnswer(index, event.target.value)} value={answers[index]}>
                  {(Object.keys(gad7AnswerLabels) as unknown as Gad7Answer[]).map((answer) => (
                    <option key={answer} value={answer}>
                      {gad7AnswerLabels[answer]}
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
              <Calculator size={16} aria-hidden="true" /> Score GAD-7
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Screening result</h2>
              <p className="tool-description">{result ? result.summary : "Run scoring to show GAD-7 total and severity band."}</p>
            </div>
            <span className="badge warn">Screening only</span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedScore ?? "0 / 21"}</strong>
              <span>GAD-7 score</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.severity ?? "--"}</strong>
              <span>Severity band</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.supportLevel ?? "--"}</strong>
              <span>Support level</span>
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
              <small>{result ? "Discuss persistent symptoms with a doctor, therapist, or qualified clinician." : "Score answers first to review support guidance."}</small>
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
          <p>Screening answers stay local. GAD-7 output is a reference screen, not a diagnosis or emergency service.</p>
        </div>
      </aside>
    </div>
  );
}
