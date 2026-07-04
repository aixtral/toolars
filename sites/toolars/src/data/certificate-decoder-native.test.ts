import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Certificate Decoder registration", () => {
  it("promotes certificate-decoder as a public native Toolars workspace", () => {
    expect(getToolBySlug("certificate-decoder")).toMatchObject({
      slug: "certificate-decoder",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/certificate-decoder"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("certificate-decoder");
  });

  it("uses native detail copy for local TLS certificate decoding", () => {
    const detail = getToolDetailBySlug("certificate-decoder");

    expect(detail?.workspaceHref).toBe("/tools/certificate-decoder");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local certificate decoding model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
