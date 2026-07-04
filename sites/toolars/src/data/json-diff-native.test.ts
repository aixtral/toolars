import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native JSON Diff registration", () => {
  it("promotes json-diff as a public native Toolars workspace", () => {
    const tool = getToolBySlug("json-diff");

    expect(tool).toMatchObject({
      slug: "json-diff",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/json-diff"
    });
    expect(publicTools.map((item) => item.slug)).toContain("json-diff");
  });

  it("uses native detail copy for payload comparison workflows", () => {
    const detail = getToolDetailBySlug("json-diff");

    expect(detail?.workspaceHref).toBe("/tools/json-diff");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Paths"]));
    expect(detail?.trustSection.title).toBe("Local JSON diff model");
    expect(detail?.overview).toContain("JSONPath-style");
  });
});
