import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Red Team Simulator registration", () => {
  it("promotes red-team-simulator as a public native Toolars workspace", () => {
    expect(getToolBySlug("red-team-simulator")).toMatchObject({
      slug: "red-team-simulator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/red-team-simulator"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("red-team-simulator");
  });

  it("uses native detail copy for local red-team simulation", () => {
    const detail = getToolDetailBySlug("red-team-simulator");

    expect(detail?.workspaceHref).toBe("/tools/red-team-simulator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local red-team simulation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
