"use client";

import { useState } from "react";
import { Rocket, Save } from "lucide-react";
import {
  buildMcpToolLaunchSteps,
  runMcpToolLaunchWorkflow,
  type McpToolLaunchResult
} from "@/lib/workflows/mcp-tool-launch";

const launchTargets = ["Internal agent", "Hosted server", "Marketplace submission"] as const;
const steps = buildMcpToolLaunchSteps();

export function McpToolLaunchWorkflow() {
  const [target, setTarget] = useState<(typeof launchTargets)[number]>("Internal agent");
  const [result, setResult] = useState<McpToolLaunchResult | null>(null);
  const progress = result?.progressPercent ?? 0;

  const runLaunchCheck = () => {
    setResult(runMcpToolLaunchWorkflow());
  };

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">MCP launch workflow</span>
        <h1>MCP Tool Launch Workflow Builder</h1>
        <p className="subtitle">Draft an MCP server manifest, test schemas, and package docs for an agent workflow.</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge workflow">Agent-ready</span>
          <span className="badge local">4 local steps</span>
          <span className="badge">8 min</span>
        </div>

        <h2 style={{ marginTop: 26 }}>Launch target</h2>
        <div className="workflow-mode-row" role="group" aria-label="Launch target">
          {launchTargets.map((item) => (
            <button
              aria-pressed={target === item}
              className={`button ${target === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setTarget(item)}
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
              <h2>Launch canvas</h2>
              <p className="tool-description">Define tools, generate manifest, test metadata, and export launch docs.</p>
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
                <span className={`badge ${step.badge === "Test" ? "warn" : "local"}`}>{step.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>Run preview</h2>
              <p className="tool-description">Simulate the launch checklist before connecting real MCP tests.</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runLaunchCheck} type="button">
              <Rocket size={16} aria-hidden="true" /> Run launch check
            </button>
          </div>

          <div
            aria-label="MCP launch progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? "Ready to launch"}</strong>
            <p>{result?.summary ?? "Generate manifest, run tests, and export docs for review."}</p>
            {result ? <small>{result.reviewGate}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>Tool chain</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href="/tools/mcp-server-builder">
            <span className="icon-tile purple">MC</span>
            <span>
              <strong>MCP Server Builder</strong>
              <small>Draft manifest and tool definitions</small>
            </span>
            <span className="badge workflow">Build</span>
          </a>
          <div className="workflow-resource-row">
            <span className="icon-tile blue">MT</span>
            <span>
              <strong>MCP Tester</strong>
              <small>Validate responses and metadata</small>
            </span>
            <span className="badge">Next</span>
          </div>
        </div>

        <div className="workflow-review-gate">
          <strong>Review gate</strong>
          <p>Marketplace-ready tools need explicit auth, rate-limit, and failure-mode notes.</p>
        </div>
      </aside>
    </div>
  );
}
