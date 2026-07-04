import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssUnitConverterWorkspace } from "./css-unit-converter-workspace";

const cssUnitConverterSourceFile = "src/app/[locale]/tools/css-unit-converter/css-unit-converter-workspace.tsx";

function scanCssUnitConverterWorkspaceSource() {
  return scanSourceText(readFileSync(cssUnitConverterSourceFile, "utf8"), cssUnitConverterSourceFile);
}

describe("CssUnitConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssUnitConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native unit conversion controls and output", () => {
    renderWithIntl(<CssUnitConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-unit-converter");
    fireEvent.change(screen.getByLabelText("Value"), { target: { value: "32" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert CSS unit" }));

    expect(screen.getByLabelText("Converted CSS value")).toHaveTextContent("2rem");
  });
});
