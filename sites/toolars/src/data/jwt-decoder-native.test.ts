import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native JWT Decoder registration", () => {
  it("promotes jwt-decoder as a public native Toolars workspace", () => {
    expect(getToolBySlug("jwt-decoder")).toMatchObject({
      slug: "jwt-decoder",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/jwt-decoder"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("jwt-decoder");
  });

  it("uses native detail copy for decode-only token inspection", () => {
    const detail = getToolDetailBySlug("jwt-decoder");

    expect(detail?.workspaceHref).toBe("/tools/jwt-decoder");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Decode-only JWT inspection model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
