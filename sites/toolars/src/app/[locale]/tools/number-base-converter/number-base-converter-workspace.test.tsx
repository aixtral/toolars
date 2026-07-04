import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { NumberBaseConverterWorkspace } from "./number-base-converter-workspace";

const numberBaseConverterSourceFile =
  "src/app/[locale]/tools/number-base-converter/number-base-converter-workspace.tsx";

function scanNumberBaseConverterWorkspaceSource() {
  return scanSourceText(readFileSync(numberBaseConverterSourceFile, "utf8"), numberBaseConverterSourceFile);
}

describe("NumberBaseConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanNumberBaseConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native number base converter controls", () => {
    renderWithIntl(<NumberBaseConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "number-base-converter");
    expect(screen.getByRole("heading", { name: "Number Base Converter" })).toBeInTheDocument();
    expect(screen.getByLabelText("Number input")).toBeInTheDocument();
    expect(screen.getByLabelText("Source base")).toHaveDisplayValue("Decimal");
  });

  it("converts decimal input into binary, octal, and hex outputs", () => {
    renderWithIntl(<NumberBaseConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Number input"), { target: { value: "255" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert number" }));

    expect(screen.getByText("11111111")).toBeInTheDocument();
    expect(screen.getByText("377")).toBeInTheDocument();
    expect(screen.getByText("FF")).toBeInTheDocument();
    expect(screen.getByText("Converted")).toBeInTheDocument();
  });
});
