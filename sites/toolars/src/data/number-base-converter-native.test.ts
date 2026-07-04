import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Number Base Converter registration", () => {
  it("promotes number-base-converter as a public native Toolars workspace", () => {
    const tool = getToolBySlug("number-base-converter");

    expect(tool).toMatchObject({
      slug: "number-base-converter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/number-base-converter"
    });
    expect(publicTools.map((item) => item.slug)).toContain("number-base-converter");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("number-base-converter");

    expect(detail?.workspaceHref).toBe("/tools/number-base-converter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "4"]));
    expect(detail?.trustSection.title).toBe("Local number conversion model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
