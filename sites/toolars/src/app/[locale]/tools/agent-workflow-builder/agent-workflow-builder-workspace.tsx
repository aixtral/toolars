"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildAgentWorkflowPlan, type AgentWorkflowPlan, type AgentWorkflowStageInput } from "@/lib/tools/agent-workflow-builder";

const defaultGoal = "Research support tickets and draft a release-risk report";
const defaultStages = "Researcher | Triage | search_docs | yes\nWriter | Synthesis | summarize, citation_check | no\nReviewer | Release review | policy_check | yes";

export function AgentWorkflowBuilderWorkspace() {
  const t = useTranslations("tools.agent-workflow-builder.workspace");
  const [goal, setGoal] = useState(defaultGoal);
  const [stagesText, setStagesText] = useState(defaultStages);
  const [result, setResult] = useState<AgentWorkflowPlan | null>(null);

  const runBuilder = () => {
    setResult(buildAgentWorkflowPlan({ goal, stages: parseStages(stagesText) }));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="agent-workflow-builder"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("reviewCopy")}</span></div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="agent-workflow-goal">
            {t("goalLabel")}
            <input className="input" id="agent-workflow-goal" onChange={(event) => setGoal(event.target.value)} value={goal} />
          </label>
          <label className="field-label" htmlFor="agent-workflow-stages" style={{ marginTop: 16 }}>
            {t("stagesLabel")}
            <textarea className="input" id="agent-workflow-stages" onChange={(event) => setStagesText(event.target.value)} rows={7} value={stagesText} />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runBuilder} type="button">{t("runButton")}</button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div>
            <Gauge size={18} aria-hidden="true" />
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric"><strong>{result?.stageCount ?? 0}</strong><span>{t("metrics.stages")}</span></article>
            <article className="llm-metric"><strong>{result ? `${result.toolCount} tools` : "0 tools"}</strong><span>{t("metrics.tools")}</span></article>
            <article className="llm-metric"><strong>{result?.handoffCount ?? 0}</strong><span>{t("metrics.handoffs")}</span></article>
            <article className="llm-metric"><strong>{result?.reviewGateCount ?? 0}</strong><span>{t("metrics.reviewGates")}</span></article>
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {(result?.checks ?? []).map((check, index) => (
              <div className="remediation-row" key={check.label}>
                <span>{index + 1}</span>
                <p><strong>{check.label}</strong><br />{check.detail}</p>
              </div>
            ))}
            {!result ? <p className="detail-aside-note">{t("waitingReview")}</p> : null}
          </div>
        </section>
        <section className="workspace-panel">
          <h2>{t("handoffTitle")}</h2>
          <p className="tool-description">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function parseStages(value: string): AgentWorkflowStageInput[] {
  return value.split(/\r?\n/).map((line) => {
    const [agent = "", name = "", tools = "", review = ""] = line.split("|").map((part) => part.trim());
    return { agent, name, tools: tools.split(",").map((tool) => tool.trim()).filter(Boolean), reviewGate: /^y|true|review$/i.test(review) };
  }).filter((stage) => stage.agent || stage.name || stage.tools.length);
}
