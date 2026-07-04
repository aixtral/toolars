import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("case-converter native registration", () => {
  it("publishes case-converter as a ready native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "case-converter");
    const detail = getToolDetailBySlug("case-converter");

    expect(tool).toMatchObject({
      slug: "case-converter",
      source: "aixtral-lab",
      status: "ready",
      visibility: "public"
    });
    expect(publicTools.map((item) => item.slug)).toContain("case-converter");
    expect(detail?.listingBadge).toMatchObject({ badge: "Native workspace", tone: "local" });
    expect(detail?.trustSection.title).toBe("Local case conversion model");
    expect(detail?.workspaceHref).toBe("/tools/case-converter");
    expect(detail?.recommendedWorkflow).toBeUndefined();
  });
});
