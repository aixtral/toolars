import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native AI Guardrail Config registration", () => {
  it("promotes ai-guardrail-config as a public native Toolars workspace", () => {
    expect(getToolBySlug("ai-guardrail-config")).toMatchObject({
      slug: "ai-guardrail-config",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/ai-guardrail-config"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("ai-guardrail-config");
  });

  it("uses native detail copy for local guardrail configuration", () => {
    const detail = getToolDetailBySlug("ai-guardrail-config");

    expect(detail?.workspaceHref).toBe("/tools/ai-guardrail-config");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local guardrail configuration model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
