import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssBorderRadiusGeneratorWorkspace } from "./css-border-radius-generator-workspace";

const cssBorderRadiusSourceFile = "src/app/[locale]/tools/css-border-radius-generator/css-border-radius-generator-workspace.tsx";

function scanCssBorderRadiusGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(cssBorderRadiusSourceFile, "utf8"), cssBorderRadiusSourceFile);
}

describe("CssBorderRadiusGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssBorderRadiusGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native border radius controls", () => {
    renderWithIntl(<CssBorderRadiusGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-border-radius-generator");
    expect(screen.getByRole("heading", { name: "CSS Border Radius Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Top left")).toBeInTheDocument();
    expect(screen.getByLabelText("Unit")).toBeInTheDocument();
  });

  it("generates four-corner border-radius CSS locally", () => {
    renderWithIntl(<CssBorderRadiusGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Top right"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate radius" }));

    expect(screen.getByLabelText("Border radius CSS output")).toHaveTextContent("border-radius: 16px 8px 16px 16px;");
    expect(screen.getByText("Expanded corners")).toBeInTheDocument();
  });
});
