import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native Base64 Converter registration", () => {
  it("promotes base64-converter as a public native Toolars workspace", () => {
    const tool = getToolBySlug("base64-converter");

    expect(tool).toMatchObject({
      slug: "base64-converter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/base64-converter"
    });
    expect(publicTools.map((item) => item.slug)).toContain("base64-converter");
  });

  it("uses native detail copy instead of the previous detail-only handoff", () => {
    const detail = getToolDetailBySlug("base64-converter");

    expect(detail?.workspaceHref).toBe("/tools/base64-converter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "URL-safe"]));
    expect(detail?.trustSection.title).toBe("Local Base64 conversion model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
    expect(detail?.overview).toContain("missing padding");
  });
});
