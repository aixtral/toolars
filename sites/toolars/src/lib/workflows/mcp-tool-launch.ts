export type McpToolLaunchStepBadge = "Local" | "Test";

export interface McpToolLaunchStep {
  title: string;
  description: string;
  badge: McpToolLaunchStepBadge;
}

export interface McpToolLaunchResult {
  progressPercent: number;
  statusTitle: string;
  summary: string;
  reviewGate: string;
}

export function buildMcpToolLaunchSteps(): McpToolLaunchStep[] {
  return [
    {
      title: "Define tools",
      description: "Runs in the MCP launch workspace.",
      badge: "Local"
    },
    {
      title: "Build manifest",
      description: "Runs in the MCP launch workspace.",
      badge: "Local"
    },
    {
      title: "Run MCP tests",
      description: "Validate schemas, responses, and agent-facing descriptions.",
      badge: "Test"
    },
    {
      title: "Export docs",
      description: "Runs in the MCP launch workspace.",
      badge: "Local"
    }
  ];
}

export function runMcpToolLaunchWorkflow(): McpToolLaunchResult {
  return {
    progressPercent: 88,
    statusTitle: "Launch checklist ready",
    summary: "Manifest generated, test payload queued, and docs export waiting for auth policy notes.",
    reviewGate: "Marketplace-ready tools need explicit auth policy notes, rate-limit notes, and failure-mode notes."
  };
}
