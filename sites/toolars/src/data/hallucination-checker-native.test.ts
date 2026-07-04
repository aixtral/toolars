import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Hallucination Checker registration", () => {
  it("promotes hallucination-checker as a public native Toolars workspace", () => {
    expect(getToolBySlug("hallucination-checker")).toMatchObject({
      slug: "hallucination-checker",
      group: "AI Developer Lab",
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/hallucination-checker"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("hallucination-checker");
  });

  it("uses native detail copy for local evidence review", () => {
    const detail = getToolDetailBySlug("hallucination-checker");

    expect(detail?.workspaceHref).toBe("/tools/hallucination-checker");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local evidence heuristic model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
