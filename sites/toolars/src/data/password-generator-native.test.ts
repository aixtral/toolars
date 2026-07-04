import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Password Generator registration", () => {
  it("promotes password-generator as a public native Toolars workspace", () => {
    expect(getToolBySlug("password-generator")).toMatchObject({
      slug: "password-generator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/password-generator"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("password-generator");
  });

  it("uses native detail copy for local credential generation", () => {
    const detail = getToolDetailBySlug("password-generator");

    expect(detail?.workspaceHref).toBe("/tools/password-generator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local password generation model");
    expect(detail?.metrics.map((metric) => metric.value)).toContain("Rules");
  });
});
