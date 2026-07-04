import { describe, expect, it } from "vitest";
import { calculateResizePlan } from "./image-resizer";

describe("image resizer", () => {
  it("preserves aspect ratio and estimates exported bytes", () => {
    const result = calculateResizePlan({
      sourceWidth: 1200,
      sourceHeight: 800,
      sourceBytes: 400_000,
      targetWidth: 600,
      targetHeight: 600,
      lockAspectRatio: true,
      format: "webp",
      quality: 80
    });

    expect(result.targetWidth).toBe(600);
    expect(result.targetHeight).toBe(400);
    expect(result.scale).toBe(0.5);
    expect(result.estimatedBytes).toBeLessThan(400_000);
    expect(result.warnings).toEqual([]);
  });
});
