import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Regex Tester registration", () => {
  it("promotes regex-tester as a public native Toolars workspace", () => {
    expect(getToolBySlug("regex-tester")).toMatchObject({
      slug: "regex-tester",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/regex-tester"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("regex-tester");
  });

  it("uses native detail copy for local pattern debugging", () => {
    const detail = getToolDetailBySlug("regex-tester");

    expect(detail?.workspaceHref).toBe("/tools/regex-tester");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local regex testing model");
    expect(detail?.metrics.map((metric) => metric.value)).toContain("Regex");
  });
});
