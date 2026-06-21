import { describe, expect, it } from "vitest";
import { calculateBurnoutAssessment, defaultBurnoutAnswers } from "./burnout-assessment";

describe("calculateBurnoutAssessment", () => {
  it("scores the default burnout answers and maps them to the source mild band", () => {
    const result = calculateBurnoutAssessment(defaultBurnoutAnswers);

    expect(result.totalScore).toBe(20);
    expect(result.formattedScore).toBe("20 / 40");
    expect(result.exhaustionScore).toBe(12);
    expect(result.detachmentScore).toBe(8);
    expect(result.severity).toBe("Mild burnout");
    expect(result.guidance).toContain("early burnout signs");
  });

  it("maps very high burnout scores to the source severe band", () => {
    const result = calculateBurnoutAssessment([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);

    expect(result.totalScore).toBe(40);
    expect(result.severity).toBe("Severe burnout");
    expect(result.isHighRisk).toBe(true);
  });
});
