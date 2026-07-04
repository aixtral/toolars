import { describe, expect, it } from "vitest";
import { scanToxicity } from "./toxicity-scanner";

describe("scanToxicity", () => {
  it("flags toxic, profanity, and threat signals with explainable categories", () => {
    const result = scanToxicity("You are a stupid idiot and I will kill your account access.");

    expect(result.safetyScore).toBeLessThan(60);
    expect(result.riskLevel).toMatch(/medium|high|critical/);
    expect(result.categories.filter((category) => category.flagged).map((category) => category.key)).toEqual(
      expect.arrayContaining(["toxicity", "insult", "threat"])
    );
    expect(result.recommendations).toContain("Route severe threat or harassment findings to a human reviewer.");
    expect(result.privacyNote).toBe("Local toxicity scan only; text stays in the browser.");
  });

  it("returns a safe result for neutral text", () => {
    const result = scanToxicity("Thanks for the update. Please send the revised rollout notes.");

    expect(result.riskLevel).toBe("safe");
    expect(result.categories.every((category) => !category.flagged)).toBe(true);
  });
});
