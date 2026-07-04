import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssBoxShadowGeneratorWorkspace } from "./css-box-shadow-generator-workspace";

const cssBoxShadowSourceFile = "src/app/[locale]/tools/css-box-shadow-generator/css-box-shadow-generator-workspace.tsx";

function scanCssBoxShadowGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(cssBoxShadowSourceFile, "utf8"), cssBoxShadowSourceFile);
}

describe("CssBoxShadowGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssBoxShadowGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native CSS box shadow controls", () => {
    renderWithIntl(<CssBoxShadowGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-box-shadow-generator");
    expect(screen.getByRole("heading", { name: "CSS Box Shadow Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("X offset")).toBeInTheDocument();
    expect(screen.getByLabelText("Y offset")).toBeInTheDocument();
    expect(screen.getByLabelText("Blur")).toBeInTheDocument();
  });

  it("applies source presets and renders multi-layer shadow CSS", () => {
    renderWithIntl(<CssBoxShadowGeneratorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Elevated" }));

    expect(screen.getByLabelText("Box shadow CSS output")).toHaveTextContent(
      "box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10);"
    );
    expect(screen.getByText("2 layers")).toBeInTheDocument();
  });
});
