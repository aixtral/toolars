import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { EnvEditorWorkspace } from "./env-editor-workspace";

const envEditorSourceFile = "src/app/[locale]/tools/env-editor/env-editor-workspace.tsx";

function scanEnvEditorWorkspaceSource() {
  return scanSourceText(readFileSync(envEditorSourceFile, "utf8"), envEditorSourceFile);
}

describe("EnvEditorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanEnvEditorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and parses env files", () => {
    renderWithIntl(<EnvEditorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "env-editor");
    expect(screen.getByRole("heading", { name: "Env Variable Editor" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(".env input"), { target: { value: "API_KEY=abc\nNODE_ENV=production" } });
    fireEvent.click(screen.getByRole("button", { name: "Parse env" }));

    expect(screen.getAllByText(/API_KEY/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2 variables/)).toBeInTheDocument();
  });
});
