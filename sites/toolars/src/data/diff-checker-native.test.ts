import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native Diff Checker registration", () => {
  it("promotes diff-checker as a public native Toolars workspace", () => {
    const tool = getToolBySlug("diff-checker");

    expect(tool).toMatchObject({
      slug: "diff-checker",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/diff-checker"
    });
    expect(publicTools.map((item) => item.slug)).toContain("diff-checker");
  });

  it("uses native detail copy for line review workflows", () => {
    const detail = getToolDetailBySlug("diff-checker");

    expect(detail?.workspaceHref).toBe("/tools/diff-checker");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Lines"]));
    expect(detail?.trustSection.title).toBe("Local text diff model");
    expect(detail?.overview).toContain("line-level");
  });
});
