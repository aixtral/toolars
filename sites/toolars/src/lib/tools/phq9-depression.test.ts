import { describe, expect, it } from "vitest";
import { calculatePhq9Depression, defaultPhq9Answers } from "./phq9-depression";

describe("calculatePhq9Depression", () => {
  it("scores the default PHQ-9 answers and maps them to the source mild band", () => {
    const result = calculatePhq9Depression(defaultPhq9Answers);

    expect(result.totalScore).toBe(8);
    expect(result.formattedScore).toBe("8 / 27");
    expect(result.severity).toBe("Mild depression");
    expect(result.hasSelfHarmRisk).toBe(false);
    expect(result.guidance).toContain("mild depression symptoms");
  });

  it("flags item 9 self-harm risk even when the total score is low", () => {
    const result = calculatePhq9Depression([0, 0, 0, 0, 0, 0, 0, 0, 1]);

    expect(result.totalScore).toBe(1);
    expect(result.severity).toBe("Minimal depression");
    expect(result.hasSelfHarmRisk).toBe(true);
    expect(result.crisisNote).toContain("urgent");
  });
});
