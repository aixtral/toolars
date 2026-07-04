import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { ColorConverterWorkspace } from "./color-converter-workspace";

const colorConverterSourceFile = "src/app/[locale]/tools/color-converter/color-converter-workspace.tsx";

function scanColorConverterWorkspaceSource() {
  return scanSourceText(readFileSync(colorConverterSourceFile, "utf8"), colorConverterSourceFile);
}

describe("ColorConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanColorConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native color converter controls", () => {
    renderWithIntl(<ColorConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "color-converter");
    expect(screen.getByRole("heading", { name: "Color Converter" })).toBeInTheDocument();
    expect(screen.getByLabelText("Color input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Convert color" })).toBeDisabled();
  });

  it("converts named colors locally into design handoff formats", () => {
    renderWithIntl(<ColorConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Color input"), { target: { value: "rebeccapurple" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert color" }));

    expect(screen.getByText("#663399")).toBeInTheDocument();
    expect(screen.getByText("rgb(102, 51, 153)")).toBeInTheDocument();
    expect(screen.getByText("hsl(270, 50%, 40%)")).toBeInTheDocument();
    expect(screen.getAllByText("Color converted").length).toBeGreaterThan(0);
  });
});
