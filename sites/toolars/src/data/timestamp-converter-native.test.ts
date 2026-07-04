import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Timestamp Converter registration", () => {
  it("promotes timestamp-converter as a public native Toolars workspace", () => {
    const tool = getToolBySlug("timestamp-converter");

    expect(tool).toMatchObject({
      slug: "timestamp-converter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/timestamp-converter"
    });
    expect(publicTools.map((item) => item.slug)).toContain("timestamp-converter");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("timestamp-converter");

    expect(detail?.workspaceHref).toBe("/tools/timestamp-converter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Unix"]));
    expect(detail?.trustSection.title).toBe("Local timestamp conversion model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
