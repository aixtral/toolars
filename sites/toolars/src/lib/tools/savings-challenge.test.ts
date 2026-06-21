import { describe, expect, it } from "vitest";
import { calculateSavingsChallenge, defaultSavingsChallengeScenario } from "./savings-challenge";

describe("calculateSavingsChallenge", () => {
  it("calculates the VitalCalc default 52-week challenge", () => {
    const result = calculateSavingsChallenge(defaultSavingsChallengeScenario);

    expect(result.mode).toBe("52week");
    expect(result.formattedTotal).toBe("¥1,378");
    expect(result.formattedAverage).toBe("¥27");
    expect(result.schedule).toHaveLength(52);
    expect(result.summary).toBe("Save ¥1,378 over 52 weeks");
  });

  it("calculates the 100-envelope challenge total and duration", () => {
    const result = calculateSavingsChallenge({
      ...defaultSavingsChallengeScenario,
      mode: "envelope"
    });

    expect(result.formattedTotal).toBe("¥5,050");
    expect(result.durationLabel).toBe("100 weeks (about 23 months)");
  });
});
