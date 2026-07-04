import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { FileSizeConverterWorkspace } from "./file-size-converter-workspace";

const fileSizeConverterSourceFile = "src/app/[locale]/tools/file-size-converter/file-size-converter-workspace.tsx";

function scanFileSizeConverterWorkspaceSource() {
  return scanSourceText(readFileSync(fileSizeConverterSourceFile, "utf8"), fileSizeConverterSourceFile);
}

describe("FileSizeConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanFileSizeConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native file size converter controls", () => {
    renderWithIntl(<FileSizeConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "file-size-converter");
    expect(screen.getByRole("heading", { name: "File Size Converter" })).toBeInTheDocument();
    expect(screen.getByLabelText("Size value")).toBeInTheDocument();
    expect(screen.getByLabelText("Unit mode")).toHaveDisplayValue("Decimal (KB, MB)");
  });

  it("converts decimal file sizes locally", () => {
    renderWithIntl(<FileSizeConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Size value"), { target: { value: "1.44" } });
    fireEvent.change(screen.getByLabelText("Source unit"), { target: { value: "MB" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert size" }));

    expect(screen.getAllByText("1,440,000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1.44").length).toBeGreaterThan(0);
    expect(screen.getByText("Converted")).toBeInTheDocument();
  });
});
