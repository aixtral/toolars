import { describe, expect, it } from "vitest";
import { getCaptureOptions, getExpectedFirstViewportSize } from "./visual-design-pack-utils.mjs";

describe("visual design-pack utilities", () => {
  it("captures mobile design screens at DPR 2 without changing CSS viewport size", () => {
    const entry = {
      id: "49",
      formFactor: "mobile",
      viewport: { width: 426, height: 923 }
    };

    expect(getCaptureOptions(entry)).toMatchObject({
      viewport: { width: 426, height: 923 },
      deviceScaleFactor: 2
    });
    expect(getExpectedFirstViewportSize(entry)).toEqual({ width: 852, height: 1846 });
  });

  it("keeps desktop design screens at DPR 1", () => {
    const entry = {
      id: "01",
      formFactor: "desktop",
      viewport: { width: 1487, height: 1058 }
    };

    expect(getCaptureOptions(entry)).toMatchObject({
      viewport: { width: 1487, height: 1058 },
      deviceScaleFactor: 1
    });
    expect(getExpectedFirstViewportSize(entry)).toEqual({ width: 1487, height: 1058 });
  });
});
