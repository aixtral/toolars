import { describe, expect, it } from "vitest";
import {
  buildMcpToolLaunchSteps,
  runMcpToolLaunchWorkflow
} from "./mcp-tool-launch";

describe("mcp tool launch workflow", () => {
  it("builds launch steps with a dedicated MCP test gate", () => {
    const steps = buildMcpToolLaunchSteps();

    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.title)).toEqual([
      "Define tools",
      "Build manifest",
      "Run MCP tests",
      "Export docs"
    ]);
    expect(steps[2].badge).toBe("Test");
    expect(steps.filter((step) => step.badge === "Local")).toHaveLength(3);
  });

  it("runs the default launch check and returns review-gate notes", () => {
    const result = runMcpToolLaunchWorkflow();

    expect(result.progressPercent).toBe(88);
    expect(result.statusTitle).toBe("Launch checklist ready");
    expect(result.summary).toContain("Manifest generated");
    expect(result.summary).toContain("test payload queued");
    expect(result.reviewGate).toContain("auth policy notes");
  });
});
