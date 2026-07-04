import { describe, expect, it } from "vitest";
import { runRagEvalBench } from "./rag-eval-bench";

describe("runRagEvalBench", () => {
  it("scores grounded answers against expected terms and cited sources", () => {
    const result = runRagEvalBench({
      cases: [
        {
          question: "What is the refund window?",
          answer: "Annual subscribers can request a refund within 14 days. [policy-1]",
          expectedTerms: ["refund", "14 days", "annual"],
          sourceIds: ["policy-1"]
        },
        {
          question: "Which plan has SSO?",
          answer: "The enterprise plan includes SSO.",
          expectedTerms: ["enterprise", "SSO"],
          sourceIds: ["security-2"]
        }
      ]
    });

    expect(result.caseCount).toBe(2);
    expect(result.averageGroundedness).toBeGreaterThan(50);
    expect(result.rows[0].status).toBe("pass");
    expect(result.rows[1].missingSourceIds).toEqual(["security-2"]);
    expect(result.summary).toContain("2 eval cases");
  });

  it("returns an empty bench result when no cases are provided", () => {
    const result = runRagEvalBench({ cases: [] });

    expect(result.caseCount).toBe(0);
    expect(result.averageGroundedness).toBe(0);
    expect(result.rows).toEqual([]);
  });
});
