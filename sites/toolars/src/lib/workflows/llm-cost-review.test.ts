import { describe, expect, it } from "vitest";
import {
  buildLlmCostReviewSteps,
  runLlmCostReviewWorkflow
} from "./llm-cost-review";

describe("llm cost review workflow", () => {
  it("builds the four local review steps from the workflow template", () => {
    const steps = buildLlmCostReviewSteps();

    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.title)).toEqual([
      "Count tokens",
      "Compare models",
      "Plan context",
      "Export budget"
    ]);
    expect(steps.every((step) => step.badge === "Local")).toBe(true);
  });

  it("runs the default launch review and returns a budget memo", () => {
    const review = runLlmCostReviewWorkflow();

    expect(review.progressPercent).toBe(76);
    expect(review.statusTitle).toBe("Cost review ready");
    expect(review.monthlyCost).toBe("$562/month");
    expect(review.monthlyTokens).toBe("558M tokens");
    expect(review.memo).toContain("routes low-risk jobs to a smaller model");
  });
});
