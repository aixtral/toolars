export type AgentWorkflowReadiness = "draft" | "review" | "ready";
export type AgentWorkflowCheckTone = "ok" | "warn";

export interface AgentWorkflowStageInput {
  name: string;
  agent: string;
  tools: string[];
  reviewGate: boolean;
}

export interface AgentWorkflowBuilderInput {
  goal: string;
  stages: AgentWorkflowStageInput[];
}

export interface AgentWorkflowCheck {
  label: string;
  tone: AgentWorkflowCheckTone;
  detail: string;
}

export interface AgentWorkflowPlan {
  goal: string;
  stageCount: number;
  toolCount: number;
  reviewGateCount: number;
  handoffCount: number;
  readiness: AgentWorkflowReadiness;
  checks: AgentWorkflowCheck[];
  summary: string;
  privacyNote: string;
}

export function buildAgentWorkflowPlan(input: AgentWorkflowBuilderInput): AgentWorkflowPlan {
  const stages = input.stages.map((stage) => ({
    ...stage,
    tools: stage.tools.map((tool) => tool.trim()).filter(Boolean)
  }));
  const stageCount = stages.length;
  const toolCount = stages.reduce((sum, stage) => sum + stage.tools.length, 0);
  const reviewGateCount = stages.filter((stage) => stage.reviewGate).length;
  const handoffCount = stages.reduce((count, stage, index) => {
    if (index === 0) return count;
    return stages[index - 1].agent.trim().toLowerCase() !== stage.agent.trim().toLowerCase() ? count + 1 : count;
  }, 0);
  const readiness = getReadiness(stageCount, toolCount, reviewGateCount);

  return {
    goal: input.goal.trim(),
    stageCount,
    toolCount,
    reviewGateCount,
    handoffCount,
    readiness,
    checks: [
      {
        label: "Workflow stages",
        tone: stageCount > 0 ? "ok" : "warn",
        detail: stageCount > 0 ? `${stageCount} stages mapped.` : "Add at least one agent stage."
      },
      {
        label: "Tool coverage",
        tone: toolCount > 0 ? "ok" : "warn",
        detail: toolCount > 0 ? `${toolCount} tool calls mapped across the workflow.` : "Map at least one native or MCP tool."
      },
      {
        label: "Review gates",
        tone: reviewGateCount >= stageCount && stageCount > 0 ? "ok" : "warn",
        detail:
          reviewGateCount >= stageCount && stageCount > 0
            ? "Every stage has a review gate."
            : `${Math.max(0, stageCount - reviewGateCount)} stages still need review gates.`
      }
    ],
    summary: `${stageCount} stages, ${toolCount} tools, ${handoffCount} handoffs, ${reviewGateCount} review gates.`,
    privacyNote: "Local workflow planning only; agent steps stay in the browser."
  };
}

function getReadiness(stageCount: number, toolCount: number, reviewGateCount: number): AgentWorkflowReadiness {
  if (stageCount === 0 || toolCount === 0) return "draft";
  if (reviewGateCount < stageCount) return "review";
  return "ready";
}
