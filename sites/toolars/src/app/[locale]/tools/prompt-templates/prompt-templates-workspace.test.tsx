import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PromptTemplatesWorkspace } from "./prompt-templates-workspace";

const promptTemplatesSourceFile = "src/app/[locale]/tools/prompt-templates/prompt-templates-workspace.tsx";

function scanPromptTemplatesSource() {
  return scanSourceText(readFileSync(promptTemplatesSourceFile, "utf8"), promptTemplatesSourceFile);
}

describe("PromptTemplatesWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPromptTemplatesSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and builds a local prompt template", () => {
    renderWithIntl(<PromptTemplatesWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "prompt-templates");
    expect(screen.getByRole("heading", { name: "Prompt Templates" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Template variables"), {
      target: { value: "research_notes, release_goal" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build prompt template" }));

    expect(screen.getAllByText(/{{research_notes}}/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Prompt template ready/).length).toBeGreaterThan(0);
  });
});
