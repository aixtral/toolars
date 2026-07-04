import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native XML Formatter registration", () => {
  it("promotes xml-formatter as a public native Toolars workspace", () => {
    const tool = getToolBySlug("xml-formatter");

    expect(tool).toMatchObject({
      slug: "xml-formatter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/xml-formatter"
    });
    expect(publicTools.map((item) => item.slug)).toContain("xml-formatter");
  });

  it("uses native detail copy for XML formatting workflows", () => {
    const detail = getToolDetailBySlug("xml-formatter");

    expect(detail?.workspaceHref).toBe("/tools/xml-formatter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "2-way"]));
    expect(detail?.trustSection.title).toBe("Local XML formatting model");
    expect(detail?.overview).toContain("format and minify");
  });
});
