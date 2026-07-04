import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native URL Parser registration", () => {
  it("promotes url-parser as a public native Toolars workspace", () => {
    const tool = getToolBySlug("url-parser");

    expect(tool).toMatchObject({
      slug: "url-parser",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/url-parser"
    });
    expect(publicTools.map((item) => item.slug)).toContain("url-parser");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("url-parser");

    expect(detail?.workspaceHref).toBe("/tools/url-parser");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "URL"]));
    expect(detail?.trustSection.title).toBe("Local URL parsing model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
