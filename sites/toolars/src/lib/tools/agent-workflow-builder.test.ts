import { describe, expect, it } from "vitest";
import { buildAgentWorkflowPlan } from "./agent-workflow-builder";

describe("buildAgentWorkflowPlan", () => {
  it("summarizes agent handoffs, tool usage, and review coverage", () => {
    const result = buildAgentWorkflowPlan({
      goal: "Research support tickets and draft a release-risk report",
      stages: [
        { name: "Triage", agent: "Researcher", tools: ["search_docs"], reviewGate: true },
        { name: "Synthesis", agent: "Writer", tools: ["summarize", "citation_check"], reviewGate: false },
        { name: "Release review", agent: "Reviewer", tools: ["policy_check"], reviewGate: true }
      ]
    });

    expect(result.stageCount).toBe(3);
    expect(result.toolCount).toBe(4);
    expect(result.reviewGateCount).toBe(2);
    expect(result.handoffCount).toBe(2);
    expect(result.readiness).toBe("review");
    expect(result.summary).toContain("3 stages");
    expect(result.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Review gates", tone: "warn" }),
      expect.objectContaining({ label: "Tool coverage", tone: "ok" })
    ]));
  });

  it("flags thin workflows that have no stages or tools", () => {
    const result = buildAgentWorkflowPlan({ goal: "Ship agent", stages: [] });

    expect(result.stageCount).toBe(0);
    expect(result.toolCount).toBe(0);
    expect(result.readiness).toBe("draft");
    expect(result.checks.map((check) => check.tone)).toContain("warn");
  });
});
