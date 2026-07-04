import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { MarkdownTableGeneratorWorkspace } from "./markdown-table-generator-workspace";

const markdownTableGeneratorSourceFile =
  "src/app/[locale]/tools/markdown-table-generator/markdown-table-generator-workspace.tsx";

function scanMarkdownTableGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(markdownTableGeneratorSourceFile, "utf8"), markdownTableGeneratorSourceFile);
}

describe("MarkdownTableGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanMarkdownTableGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and generates a markdown table", () => {
    renderWithIntl(<MarkdownTableGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "markdown-table-generator");
    expect(screen.getByRole("heading", { name: "Markdown Table Generator" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("CSV table"), {
      target: { value: "Tool,Status\nPrompt Templates,Ready" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate table" }));

    expect(screen.getAllByText(/\| Tool \| Status \|/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1 rows/)).toBeInTheDocument();
  });
});
