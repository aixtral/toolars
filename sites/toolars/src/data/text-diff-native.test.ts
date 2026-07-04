import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native Text Diff registration", () => {
  it("promotes text-diff as a public native Toolars workspace", () => {
    const tool = getToolBySlug("text-diff");

    expect(tool).toMatchObject({
      slug: "text-diff",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/text-diff"
    });
    expect(publicTools.map((item) => item.slug)).toContain("text-diff");
  });

  it("uses native detail copy for option-aware diff workflows", () => {
    const detail = getToolDetailBySlug("text-diff");

    expect(detail?.workspaceHref).toBe("/tools/text-diff");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Options"]));
    expect(detail?.trustSection.title).toBe("Local option-aware diff model");
    expect(detail?.overview).toContain("ignore whitespace");
  });
});
