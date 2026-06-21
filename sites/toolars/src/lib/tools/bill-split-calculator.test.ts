import { describe, expect, it } from "vitest";
import { calculateBillSplit, defaultBillSplitScenario } from "./bill-split-calculator";

describe("calculateBillSplit", () => {
  it("calculates the default VitalCalc equal bill split", () => {
    const result = calculateBillSplit(defaultBillSplitScenario);

    expect(result.formattedSubtotal).toBe("$120.00");
    expect(result.formattedTipAmount).toBe("$21.60");
    expect(result.formattedTaxAmount).toBe("$9.90");
    expect(result.formattedGrandTotal).toBe("$151.50");
    expect(result.formattedEqualShare).toBe("$37.88");
    expect(result.summary).toBe("4 people, 18% tip, 8.25% tax");
  });

  it("returns itemized guidance when the split mode changes", () => {
    const result = calculateBillSplit({
      subtotal: 80,
      people: 2,
      tipPercent: 10,
      taxPercent: 5,
      splitMode: "itemized"
    });

    expect(result.splitMode).toBe("itemized");
    expect(result.formattedGrandTotal).toBe("$92.00");
    expect(result.guidance).toContain("itemized");
  });
});
