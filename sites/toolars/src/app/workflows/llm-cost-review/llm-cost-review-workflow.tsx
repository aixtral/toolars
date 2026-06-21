"use client";

import { useState } from "react";
import { Save, Workflow } from "lucide-react";
import {
  buildLlmCostReviewSteps,
  runLlmCostReviewWorkflow,
  type LlmCostReviewResult
} from "@/lib/workflows/llm-cost-review";

const reviewModes = ["MVP launch", "Team budget", "API pricing"] as const;
const steps = buildLlmCostReviewSteps();

export function LlmCostReviewWorkflow() {
  const [mode, setMode] = useState<(typeof reviewModes)[number]>("MVP launch");
  const [result, setResult] = useState<LlmCostReviewResult | null>(null);

  const runReview = () => {
    setResult(runLlmCostReviewWorkflow());
  };

  const progress = result?.progressPercent ?? 0;

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">Cost workflow</span>
        <h1>LLM Cost Review Workflow Builder</h1>
        <p className="subtitle">Estimate token cost, compare models, and plan a context budget before shipping.</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge local">4 local steps</span>
          <span className="badge">5 min</span>
          <span className="badge workflow">Launch review</span>
        </div>

        <h2 style={{ marginTop: 26 }}>Review mode</h2>
        <div className="workflow-mode-row" role="group" aria-label="Review mode">
          {reviewModes.map((item) => (
            <button
              aria-pressed={mode === item}
              className={`button ${mode === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Cost review canvas</h2>
              <p className="tool-description">Estimate usage, compare models, plan context, and export budget notes.</p>
            </div>
            <button className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> Save template
            </button>
          </div>

          <div className="workflow-step-list">
            {steps.map((step, index) => (
              <article className="workflow-step-row" key={step.title}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </span>
                <span className="badge local">{step.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>Run preview</h2>
              <p className="tool-description">Simulate a launch cost review from the current usage assumptions.</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runReview} type="button">
              <Workflow size={16} aria-hidden="true" /> Run review
            </button>
          </div>

          <div
            aria-label="Cost review progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? "Ready to review"}</strong>
            <p>{result?.memo ?? "Open the calculator, estimate monthly tokens, and export a budget memo."}</p>
            {result ? <small>{result.monthlyTokens}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>Tool chain</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href="/tools/llm-cost-calculator">
            <span className="icon-tile">LL</span>
            <span>
              <strong>LLM Cost Calculator</strong>
              <small>Estimate token spend by usage profile</small>
            </span>
            <span className="badge local">Estimate</span>
          </a>
          <div className="workflow-resource-row">
            <span className="icon-tile blue">MO</span>
            <span>
              <strong>Model Comparator</strong>
              <small>Compare model price and fit</small>
            </span>
            <span className="badge">Next</span>
          </div>
        </div>

        <div className="llm-recommended-plan">
          <strong>Budget policy</strong>
          <p>Use Team plan when approval thresholds and shared model defaults become part of the workflow.</p>
        </div>
      </aside>
    </div>
  );
}
