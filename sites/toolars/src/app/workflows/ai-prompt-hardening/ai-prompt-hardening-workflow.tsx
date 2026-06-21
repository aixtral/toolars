"use client";

import { useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import {
  buildAiPromptHardeningSteps,
  runAiPromptHardeningWorkflow,
  type AiPromptHardeningResult
} from "@/lib/workflows/ai-prompt-hardening";

const inputSurfaces = ["System prompt", "Tool instruction", "Retrieved text"] as const;
const steps = buildAiPromptHardeningSteps();

export function AiPromptHardeningWorkflow() {
  const [surface, setSurface] = useState<(typeof inputSurfaces)[number]>("System prompt");
  const [result, setResult] = useState<AiPromptHardeningResult | null>(null);
  const progress = result?.progressPercent ?? 0;

  const runHardening = () => {
    setResult(runAiPromptHardeningWorkflow());
  };

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">AI security workflow</span>
        <h1>AI Prompt Hardening Workflow Builder</h1>
        <p className="subtitle">Scan a prompt, detect injection risk, add guardrails, and generate a red-team checklist.</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge local">AI review optional</span>
          <span className="badge warn">Injection risk</span>
          <span className="badge">4 min</span>
        </div>

        <h2 style={{ marginTop: 26 }}>Input surfaces</h2>
        <div className="workflow-mode-row" role="group" aria-label="Input surfaces">
          {inputSurfaces.map((item) => (
            <button
              aria-pressed={surface === item}
              className={`button ${surface === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setSurface(item)}
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
              <h2>Hardening canvas</h2>
              <p className="tool-description">Move from raw prompt to risk report, guardrails, and red-team variants.</p>
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
                <span className={`badge ${step.badge === "Scan" ? "warn" : "local"}`}>{step.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>Run preview</h2>
              <p className="tool-description">Simulate guardrail generation before wiring real scanners.</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runHardening} type="button">
              <ShieldCheck size={16} aria-hidden="true" /> Run hardening
            </button>
          </div>

          <div
            aria-label="Prompt hardening progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? "Ready to harden"}</strong>
            <p>{result?.summary ?? "Paste a prompt and run the scanner to generate guardrails."}</p>
            {result ? <small>{result.consentNote}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>Tool chain</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href="/tools/prompt-injection-scanner">
            <span className="icon-tile rose">PR</span>
            <span>
              <strong>Prompt Injection Scanner</strong>
              <small>Detect override and exfiltration patterns</small>
            </span>
            <span className="badge warn">Scan</span>
          </a>
          <a className="workflow-resource-row" href="/tools/json-repair">
            <span className="icon-tile amber">JS</span>
            <span>
              <strong>JSON Repair</strong>
              <small>Clean scanner report payloads</small>
            </span>
            <span className="badge local">Local</span>
          </a>
        </div>

        <div className="workflow-review-gate">
          <strong>AI deep review</strong>
          <p>Optional model-assisted review should require explicit consent.</p>
          <button className="button button-outline-neutral" type="button">
            Review consent
          </button>
        </div>
      </aside>
    </div>
  );
}
