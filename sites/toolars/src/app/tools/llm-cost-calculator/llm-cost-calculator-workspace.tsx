"use client";

import { useState } from "react";
import { Calculator, Download, Save, TrendingUp } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  calculateLlmCost,
  llmCostProfiles,
  type LlmCostInput,
  type LlmCostProfileKey,
  type LlmCostResult
} from "@/lib/tools/llm-cost-calculator";

const defaultScenario: LlmCostInput = {
  inputTokensPerRequest: 2400,
  outputTokensPerRequest: 700,
  requestsPerMonth: 180000,
  modelProfile: "balanced"
};

const costRows = [
  ["Local", "Static estimate, no account required", "local"],
  ["BYOK", "Provider-specific pricing later", ""],
  ["Pro", "Save historical budgets", "local"]
] as const;

const checklistRows = [
  "Cap maximum context and output length.",
  "Route simple tasks to a smaller model profile.",
  "Track rejected, retried, and cached requests."
];

export function LlmCostCalculatorWorkspace() {
  const [scenario, setScenario] = useState<LlmCostInput>(defaultScenario);
  const [result, setResult] = useState<LlmCostResult | null>(null);

  const calculate = () => {
    setResult(calculateLlmCost(scenario));
  };

  const saveScenario = () => {
    window.localStorage.setItem("toolars.llm-cost-calculator.scenario", JSON.stringify(scenario));
  };

  const updateNumber = (key: keyof Pick<LlmCostInput, "inputTokensPerRequest" | "outputTokensPerRequest" | "requestsPerMonth">, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateModel = (value: string) => {
    setScenario((current) => ({
      ...current,
      modelProfile: value as LlmCostProfileKey
    }));
    setResult(null);
  };

  const inputBar = result?.inputSharePercent ?? 77;
  const outputBar = result?.outputSharePercent ?? 23;

  return (
    <AiLabWorkbenchShell
      artifactState={result ? "Budget estimate" : "Waiting"}
      providerRoute="Pricing table"
      runMode="Static estimator"
      toolSlug="llm-cost-calculator"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">LLM cost planning</span>
        <h1>LLM Cost Calculator</h1>
        <p className="subtitle">Estimate monthly spend, token mix, and launch risk before an AI workflow reaches production.</p>

        <h2 style={{ marginTop: 28 }}>Cost model</h2>
        <div className="profile-list">
          {costRows.map(([label, text, tone]) => (
            <div className="profile-row" key={label}>
              <span className={`badge ${tone}`}>{label}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/llm-cost-calculator/about">Tool details</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Usage inputs</h2>
              <p className="tool-description">Use conservative launch assumptions, then compare model fit.</p>
            </div>
            <span className="badge local">Estimator</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="llm-input-tokens">
              Input tokens / request
              <input
                className="input"
                id="llm-input-tokens"
                min={0}
                onChange={(event) => updateNumber("inputTokensPerRequest", event.target.value)}
                type="number"
                value={scenario.inputTokensPerRequest}
              />
            </label>
            <label className="field-label" htmlFor="llm-output-tokens">
              Output tokens / request
              <input
                className="input"
                id="llm-output-tokens"
                min={0}
                onChange={(event) => updateNumber("outputTokensPerRequest", event.target.value)}
                type="number"
                value={scenario.outputTokensPerRequest}
              />
            </label>
            <label className="field-label" htmlFor="llm-requests">
              Requests / month
              <input
                className="input"
                id="llm-requests"
                min={0}
                onChange={(event) => updateNumber("requestsPerMonth", event.target.value)}
                type="number"
                value={scenario.requestsPerMonth}
              />
            </label>
            <label className="field-label" htmlFor="llm-model-profile">
              Model profile
              <select className="input" id="llm-model-profile" onChange={(event) => updateModel(event.target.value)} value={scenario.modelProfile}>
                {Object.values(llmCostProfiles).map((profile) => (
                  <option key={profile.key} value={profile.key}>{profile.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveScenario}>
              <Save size={16} aria-hidden="true" /> Save scenario
            </button>
            <button className="button button-solid" type="button" onClick={calculate}>
              <Calculator size={16} aria-hidden="true" /> Calculate cost
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Monthly estimate</h2>
              <p className="tool-description">{result ? result.summary : "Run calculation to estimate monthly spend."}</p>
            </div>
            <button className="button button-outline" type="button">
              <Download size={16} aria-hidden="true" /> Export budget
            </button>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalCost ?? "$0"}</strong>
              <span>Estimated monthly cost</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyTokens ?? "0M"}</strong>
              <span>Monthly tokens</span>
            </article>
          </div>

          <div className="llm-bar-stack" aria-label="Cost mix">
            <span className="llm-bar input" style={{ width: `${inputBar}%` }}>Input tokens</span>
            <span className="llm-bar output" style={{ width: `${outputBar}%` }}>Output tokens</span>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{result?.recommendation ?? "Waiting for estimate"}</strong>
              <small>{result ? "Review token mix before launch and set an owner for monthly budget drift." : "Calculate first to classify launch budget risk."}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Review checklist</span>
        <h2 style={{ marginTop: 12 }}>Before production</h2>
        <div className="remediation-list">
          {checklistRows.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>Recommended plan</strong>
          <p>Use Team once budgets need approval flows and shared model policies.</p>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}
