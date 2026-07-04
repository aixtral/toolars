import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { ExtractTablesWorkspace } from "./extract-tables-workspace";

const extractTablesSourceFile = "src/app/[locale]/tools/extract-tables/extract-tables-workspace.tsx";

function scanExtractTablesWorkspaceSource() {
  return scanSourceText(readFileSync(extractTablesSourceFile, "utf8"), extractTablesSourceFile);
}

describe("ExtractTablesWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanExtractTablesWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native table extraction planning controls", () => {
    renderWithIntl(<ExtractTablesWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "extract-tables");
    expect(screen.getByRole("heading", { name: "Extract Tables" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Page range")).toHaveValue("1-3");
  });

  it("plans a table extraction handoff for selected pages", () => {
    renderWithIntl(<ExtractTablesWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF metadata"), {
      target: { value: "Q2 Report.pdf, 12, 2400000" }
    });
    fireEvent.change(screen.getByLabelText("Page range"), {
      target: { value: "2-5" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan table extraction" }));

    expect(screen.getByLabelText("Table extraction output")).toHaveTextContent("Q2_Report_tables.csv");
    expect(screen.getAllByText("Extractor handoff ready").length).toBeGreaterThan(0);
  });
});
