import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native File Size Converter registration", () => {
  it("promotes file-size-converter as a public native Toolars workspace", () => {
    const tool = getToolBySlug("file-size-converter");

    expect(tool).toMatchObject({
      slug: "file-size-converter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/file-size-converter"
    });
    expect(publicTools.map((item) => item.slug)).toContain("file-size-converter");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("file-size-converter");

    expect(detail?.workspaceHref).toBe("/tools/file-size-converter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "SI/IEC"]));
    expect(detail?.trustSection.title).toBe("Local file size conversion model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
