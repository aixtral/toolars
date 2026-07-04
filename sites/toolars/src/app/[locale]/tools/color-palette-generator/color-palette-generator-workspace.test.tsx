import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { ColorPaletteGeneratorWorkspace } from "./color-palette-generator-workspace";

const colorPaletteGeneratorSourceFile =
  "src/app/[locale]/tools/color-palette-generator/color-palette-generator-workspace.tsx";

function scanColorPaletteGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(colorPaletteGeneratorSourceFile, "utf8"), colorPaletteGeneratorSourceFile);
}

describe("ColorPaletteGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanColorPaletteGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native palette generator controls", () => {
    renderWithIntl(<ColorPaletteGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "color-palette-generator");
    expect(screen.getByRole("heading", { name: "Color Palette Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Base color")).toBeInTheDocument();
    expect(screen.getByLabelText("Harmony")).toBeInTheDocument();
  });

  it("generates triadic swatches and CSS variables locally", () => {
    renderWithIntl(<ColorPaletteGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Base color"), { target: { value: "#ff0000" } });
    fireEvent.change(screen.getByLabelText("Harmony"), { target: { value: "triadic" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate palette" }));

    expect(screen.getByText("#FF0000")).toBeInTheDocument();
    expect(screen.getByText("#00FF00")).toBeInTheDocument();
    expect(screen.getByText("#0000FF")).toBeInTheDocument();
    expect(screen.getByLabelText("Palette CSS variables")).toHaveTextContent("--color-1: #FF0000;");
  });
});
