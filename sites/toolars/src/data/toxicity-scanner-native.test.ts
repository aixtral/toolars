import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Toxicity Scanner registration", () => {
  it("promotes toxicity-scanner as a public native Toolars workspace", () => {
    expect(getToolBySlug("toxicity-scanner")).toMatchObject({
      slug: "toxicity-scanner",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/toxicity-scanner"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("toxicity-scanner");
  });

  it("uses native detail copy for local moderation review", () => {
    const detail = getToolDetailBySlug("toxicity-scanner");

    expect(detail?.workspaceHref).toBe("/tools/toxicity-scanner");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local toxicity moderation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
