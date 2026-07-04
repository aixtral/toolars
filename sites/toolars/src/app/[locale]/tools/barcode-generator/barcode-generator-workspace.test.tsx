import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { BarcodeGeneratorWorkspace } from "./barcode-generator-workspace";

const barcodeGeneratorSourceFile =
  "src/app/[locale]/tools/barcode-generator/barcode-generator-workspace.tsx";

function scanBarcodeGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(barcodeGeneratorSourceFile, "utf8"), barcodeGeneratorSourceFile);
}

describe("BarcodeGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanBarcodeGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native barcode SVG controls", () => {
    renderWithIntl(<BarcodeGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "barcode-generator");
    expect(screen.getByRole("heading", { name: "Barcode Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Barcode value")).toBeInTheDocument();
    expect(screen.getByLabelText("Barcode format")).toHaveDisplayValue("CODE39");
  });

  it("generates local barcode SVG output", () => {
    renderWithIntl(<BarcodeGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Barcode value"), {
      target: { value: "TOOLARS-42" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate barcode" }));

    expect(screen.getByLabelText("Barcode SVG output")).toHaveTextContent("<svg");
    expect(screen.getAllByText("Barcode ready").length).toBeGreaterThan(0);
  });
});
