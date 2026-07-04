import { describe, expect, it } from "vitest";
import { buildPromptTemplate } from "./prompt-templates";

describe("buildPromptTemplate", () => {
  it("builds a reusable prompt template with variables and review checks", () => {
    const result = buildPromptTemplate({
      task: "Summarize customer research",
      audience: "Product team",
      tone: "concise",
      variables: "research_notes, release_goal",
      constraints: "Cite every claim\nFlag uncertainty"
    });

    expect(result.template).toContain("{{research_notes}}");
    expect(result.template).toContain("Product team");
    expect(result.variables).toEqual(["research_notes", "release_goal"]);
    expect(result.reviewChecklist).toEqual(expect.arrayContaining(["Cite every claim", "Flag uncertainty"]));
    expect(result.privacyNote).toMatch(/local/i);
  });
});
