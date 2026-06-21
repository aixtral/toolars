import { describe, expect, it } from "vitest";
import { calculateAdhdScreener, defaultAdhdScreenerAnswers } from "./adhd-screener";

describe("calculateAdhdScreener", () => {
  it("scores the default ASRS answers and maps them to the source positive outcome", () => {
    const result = calculateAdhdScreener(defaultAdhdScreenerAnswers);

    expect(result.totalScore).toBe(10);
    expect(result.formattedScore).toBe("10 / 24");
    expect(result.positiveCount).toBe(4);
    expect(result.outcome).toBe("Screening positive");
    expect(result.guidance).toContain("professional evaluation");
  });

  it("maps two positive answers to the source borderline outcome", () => {
    const result = calculateAdhdScreener([2, 2, 1, 1, 1, 1]);

    expect(result.partAScore).toBe(5);
    expect(result.partBScore).toBe(3);
    expect(result.positiveCount).toBe(2);
    expect(result.outcome).toBe("Borderline / uncertain");
  });
});
