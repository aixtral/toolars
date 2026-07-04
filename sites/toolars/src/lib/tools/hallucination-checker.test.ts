import { describe, expect, it } from "vitest";
import { checkHallucinations } from "./hallucination-checker";

describe("checkHallucinations", () => {
  it("flags unsupported numerical, citation, quote, and future-certainty claims", () => {
    const result = checkHallucinations({
      answer:
        'Studies indicate 87% of teams will definitely replace search in 2027. "This exact customer quote is longer than twenty characters."',
      sources: "The supplied source only says teams are evaluating search improvements."
    });

    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.riskLevel).toMatch(/high|critical/);
    expect(result.claims.map((claim) => claim.type)).toEqual(
      expect.arrayContaining(["statistic", "numerical", "quote", "reference", "future"])
    );
    expect(result.unsupportedClaims).toBeGreaterThanOrEqual(4);
    expect(result.summary).toContain("unsupported");
    expect(result.privacyNote).toBe("Local hallucination heuristic only; answer and source text stay in the browser.");
  });

  it("keeps grounded cautious answers low risk", () => {
    const result = checkHallucinations({
      answer: "The release notes say the feature is in beta, and the exact rollout date is not provided.",
      sources: "Release notes: the feature is in beta. No exact rollout date is provided."
    });

    expect(result.riskLevel).toBe("low");
    expect(result.score).toBeLessThan(40);
  });
});
