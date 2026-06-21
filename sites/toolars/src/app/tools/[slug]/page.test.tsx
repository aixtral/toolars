import { describe, expect, it } from "vitest";
import { allDetailSlugs, getToolDetailBySlug } from "@/data/tool-details";
import { generateStaticParams, getWorkspaceShellActive } from "./page";

describe("generic tool workspace route", () => {
  it("generates workspace params for every public detail slug", () => {
    expect(generateStaticParams()).toHaveLength(allDetailSlugs.length);
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "loan-calculator" },
        { slug: "pregnancy-due-date" },
        { slug: "pdf-toolkit" },
        { slug: "prompt-injection-scanner" }
      ])
    );
  });

  it("selects shell context from the resolved tool detail", () => {
    const loan = getToolDetailBySlug("loan-calculator");
    const prompt = getToolDetailBySlug("prompt-injection-scanner");
    const pdf = getToolDetailBySlug("pdf-toolkit");

    if (!loan || !prompt || !pdf) throw new Error("missing route test detail data");

    expect(getWorkspaceShellActive(loan)).toBe("explore");
    expect(getWorkspaceShellActive(prompt)).toBe("ai-developer");
    expect(getWorkspaceShellActive(pdf)).toBe("pdf");
  });
});
