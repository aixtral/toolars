import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PasswordGeneratorWorkspace } from "./password-generator-workspace";

const passwordGeneratorSourceFile = "src/app/[locale]/tools/password-generator/password-generator-workspace.tsx";

function scanPasswordGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(passwordGeneratorSourceFile, "utf8"), passwordGeneratorSourceFile);
}

describe("PasswordGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPasswordGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native Password Generator controls", () => {
    renderWithIntl(<PasswordGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "password-generator");
    expect(screen.getByRole("heading", { name: "Password Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Password length")).toHaveValue(20);
    expect(screen.getByRole("button", { name: "Generate password" })).toBeEnabled();
  });

  it("generates a local password with strength metadata", () => {
    renderWithIntl(<PasswordGeneratorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate password" }));

    expect(screen.getAllByText("Generated password").length).toBeGreaterThan(0);
    expect(screen.getByTestId("password-output").textContent).toHaveLength(20);
    expect(screen.getByText("Strength")).toBeInTheDocument();
  });
});
