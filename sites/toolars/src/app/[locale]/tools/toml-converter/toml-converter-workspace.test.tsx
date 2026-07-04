import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { TomlConverterWorkspace } from "./toml-converter-workspace";

const tomlConverterSourceFile = "src/app/[locale]/tools/toml-converter/toml-converter-workspace.tsx";

function scanTomlConverterWorkspaceSource() {
  return scanSourceText(readFileSync(tomlConverterSourceFile, "utf8"), tomlConverterSourceFile);
}

describe("TomlConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanTomlConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and converts TOML to JSON", () => {
    renderWithIntl(<TomlConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "toml-converter");
    expect(screen.getByRole("heading", { name: "TOML Converter" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("TOML or JSON input"), { target: { value: 'title = "Toolars"' } });
    fireEvent.click(screen.getByRole("button", { name: "Convert TOML" }));

    expect(screen.getByText(/"title": "Toolars"/)).toBeInTheDocument();
  });
});
