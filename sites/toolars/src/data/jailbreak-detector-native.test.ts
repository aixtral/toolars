import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Jailbreak Detector registration", () => {
  it("promotes jailbreak-detector as a public native Toolars workspace", () => {
    expect(getToolBySlug("jailbreak-detector")).toMatchObject({
      slug: "jailbreak-detector",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/jailbreak-detector"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("jailbreak-detector");
  });

  it("uses native detail copy for local jailbreak review", () => {
    const detail = getToolDetailBySlug("jailbreak-detector");

    expect(detail?.workspaceHref).toBe("/tools/jailbreak-detector");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local jailbreak heuristic model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
