import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssGridGeneratorWorkspace } from "./css-grid-generator-workspace";

const cssGridSourceFile = "src/app/[locale]/tools/css-grid-generator/css-grid-generator-workspace.tsx";

function scanCssGridGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(cssGridSourceFile, "utf8"), cssGridSourceFile);
}

describe("CssGridGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssGridGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native grid controls and generated template CSS", () => {
    renderWithIntl(<CssGridGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-grid-generator");
    expect(screen.getByRole("heading", { name: "CSS Grid Generator" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Columns"), { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate grid CSS" }));

    expect(screen.getByLabelText("Grid CSS output")).toHaveTextContent("repeat(4");
  });
});
