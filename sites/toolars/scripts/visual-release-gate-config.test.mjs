import { describe, expect, it } from "vitest";
import {
  DESKTOP_HOTSPOT_VISUAL_IDS,
  MOBILE_RELEASE_GATE_VISUAL_IDS,
  getReleaseGateDefinitions,
  selectReleaseGateDefinitions
} from "./visual-release-gate-config.mjs";

describe("visual release gate config", () => {
  it("targets the 28 mobile design-pack screens first", () => {
    expect(MOBILE_RELEASE_GATE_VISUAL_IDS).toHaveLength(28);
    expect(MOBILE_RELEASE_GATE_VISUAL_IDS[0]).toBe("04");
    expect(MOBILE_RELEASE_GATE_VISUAL_IDS.at(-1)).toBe("57");
    expect(MOBILE_RELEASE_GATE_VISUAL_IDS).toContain("53");
  });

  it("targets the four desktop hotspot screens requested for release gating", () => {
    expect(DESKTOP_HOTSPOT_VISUAL_IDS).toEqual(["01", "02", "03", "05"]);
  });

  it("selects scoped release gates with explicit default thresholds", () => {
    expect(getReleaseGateDefinitions()).toEqual([
      {
        id: "mobile-28",
        ids: MOBILE_RELEASE_GATE_VISUAL_IDS,
        maxRatio: 0.115
      },
      {
        id: "desktop-hotspots",
        ids: DESKTOP_HOTSPOT_VISUAL_IDS,
        maxRatio: 0.13
      }
    ]);
    expect(selectReleaseGateDefinitions("mobile")).toHaveLength(1);
    expect(selectReleaseGateDefinitions("desktop-hotspots")[0].ids).toEqual(DESKTOP_HOTSPOT_VISUAL_IDS);
    expect(selectReleaseGateDefinitions("all")).toHaveLength(2);
  });
});
