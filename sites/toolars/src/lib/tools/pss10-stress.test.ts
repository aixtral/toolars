import { describe, expect, it } from "vitest";
import { calculatePss10Stress, defaultPss10Answers } from "./pss10-stress";

describe("calculatePss10Stress", () => {
  it("scores the default PSS-10 answers and maps them to the source moderate band", () => {
    const result = calculatePss10Stress(defaultPss10Answers);

    expect(result.totalScore).toBe(20);
    expect(result.formattedScore).toBe("20 / 40");
    expect(result.severity).toBe("Moderate stress");
    expect(result.guidance).toContain("moderate");
  });

  it("reverse scores source items 4, 5, 7, 9, and 10", () => {
    const result = calculatePss10Stress([4, 4, 4, 0, 0, 4, 0, 4, 0, 0]);

    expect(result.totalScore).toBe(40);
    expect(result.severity).toBe("High stress");
    expect(result.reverseScoredItems).toEqual([4, 5, 7, 9, 10]);
  });
});
