import { describe, expect, it } from "vitest";
import { calculateTip, defaultTipScenario } from "./tip-calculator";

describe("calculateTip", () => {
  it("calculates the VitalCalc default tip and per-person split", () => {
    const result = calculateTip(defaultTipScenario);

    expect(result.formattedBillAmount).toBe("$85.50");
    expect(result.formattedTipAmount).toBe("$15.39");
    expect(result.formattedTotalBill).toBe("$100.89");
    expect(result.formattedPerPersonShare).toBe("$50.45");
    expect(result.summary).toBe("18% tip across 2 people");
  });

  it("normalizes invalid people counts to one person", () => {
    const result = calculateTip({
      billAmount: 40,
      tipPercent: 20,
      people: 0
    });

    expect(result.people).toBe(1);
    expect(result.formattedPerPersonShare).toBe("$48.00");
  });
});
