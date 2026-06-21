import { describe, expect, it } from "vitest";
import {
  buildAiPromptHardeningSteps,
  runAiPromptHardeningWorkflow
} from "./ai-prompt-hardening";

describe("ai prompt hardening workflow", () => {
  it("builds hardening steps with a dedicated scan gate", () => {
    const steps = buildAiPromptHardeningSteps();

    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.title)).toEqual([
      "Paste prompt",
      "Scan injection risk",
      "Add guardrails",
      "Red-team variants"
    ]);
    expect(steps[1].badge).toBe("Scan");
    expect(steps.filter((step) => step.badge === "Local")).toHaveLength(3);
  });

  it("runs the default hardening preview and returns guardrail notes", () => {
    const result = runAiPromptHardeningWorkflow();

    expect(result.progressPercent).toBe(82);
    expect(result.statusTitle).toBe("Hardening report ready");
    expect(result.summary).toContain("3 injection patterns found");
    expect(result.summary).toContain("Guardrails");
    expect(result.summary).toContain("red-team variants");
    expect(result.consentNote).toContain("explicit consent");
  });
});
