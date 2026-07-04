import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CodeMinifierWorkspace } from "./code-minifier-workspace";

const codeMinifierSourceFile = "src/app/[locale]/tools/code-minifier/code-minifier-workspace.tsx";

function scanCodeMinifierWorkspaceSource() {
  return scanSourceText(readFileSync(codeMinifierSourceFile, "utf8"), codeMinifierSourceFile);
}

describe("CodeMinifierWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCodeMinifierWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and minifies code locally", () => {
    renderWithIntl(<CodeMinifierWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "code-minifier");
    expect(screen.getByRole("heading", { name: "Code Minifier" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Code input"), { target: { value: "function add(a, b) { return a + b; }" } });
    fireEvent.click(screen.getByRole("button", { name: "Minify code" }));

    expect(screen.getByText(/function add\(a,b\)/)).toBeInTheDocument();
  });
});
