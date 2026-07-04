import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native PII Scanner registration", () => {
  it("promotes pii-scanner as a public native Toolars workspace", () => {
    expect(getToolBySlug("pii-scanner")).toMatchObject({
      slug: "pii-scanner",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/pii-scanner"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("pii-scanner");
  });

  it("uses native detail copy for local PII scanning", () => {
    const detail = getToolDetailBySlug("pii-scanner");

    expect(detail?.workspaceHref).toBe("/tools/pii-scanner");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local PII redaction model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
