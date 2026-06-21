import { describe, expect, it } from "vitest";
import { calculateDiscount, defaultDiscountScenario } from "./discount-calculator";

describe("calculateDiscount", () => {
  it("calculates the VitalCalc default checkout discount", () => {
    const result = calculateDiscount(defaultDiscountScenario);

    expect(result.formattedOriginalPrice).toBe("$100.00");
    expect(result.formattedDiscountAmount).toBe("$20.00");
    expect(result.formattedPriceAfterDiscount).toBe("$80.00");
    expect(result.formattedTaxAmount).toBe("$6.40");
    expect(result.formattedFinalPrice).toBe("$86.40");
    expect(result.summary).toBe("20% off $100.00");
  });

  it("returns zero tax when tax rate is omitted", () => {
    const result = calculateDiscount({
      originalPrice: 50,
      discountPercent: 10,
      taxPercent: 0
    });

    expect(result.formattedDiscountAmount).toBe("$5.00");
    expect(result.formattedTaxAmount).toBe("$0.00");
    expect(result.formattedFinalPrice).toBe("$45.00");
  });
});
