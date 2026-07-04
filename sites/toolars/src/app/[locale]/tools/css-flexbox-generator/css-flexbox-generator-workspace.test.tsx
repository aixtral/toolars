import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssFlexboxGeneratorWorkspace } from "./css-flexbox-generator-workspace";

const cssFlexboxSourceFile = "src/app/[locale]/tools/css-flexbox-generator/css-flexbox-generator-workspace.tsx";

function scanCssFlexboxGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(cssFlexboxSourceFile, "utf8"), cssFlexboxSourceFile);
}

describe("CssFlexboxGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssFlexboxGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native flexbox controls and generated CSS", () => {
    renderWithIntl(<CssFlexboxGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-flexbox-generator");
    expect(screen.getByRole("heading", { name: "CSS Flexbox Generator" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Gap"), { target: { value: "24" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate flex CSS" }));

    expect(screen.getByLabelText("Flexbox CSS output")).toHaveTextContent("gap: 24px;");
  });
});
