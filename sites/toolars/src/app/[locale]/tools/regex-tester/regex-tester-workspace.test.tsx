import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { RegexTesterWorkspace } from "./regex-tester-workspace";

const regexTesterSourceFile = "src/app/[locale]/tools/regex-tester/regex-tester-workspace.tsx";

function scanRegexTesterWorkspaceSource() {
  return scanSourceText(readFileSync(regexTesterSourceFile, "utf8"), regexTesterSourceFile);
}

describe("RegexTesterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanRegexTesterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native Regex Tester controls", () => {
    renderWithIntl(<RegexTesterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "regex-tester");
    expect(screen.getByRole("heading", { name: "Regex Tester" })).toBeInTheDocument();
    expect(screen.getByLabelText("Pattern")).toBeInTheDocument();
    expect(screen.getByLabelText("Sample text")).toBeInTheDocument();
  });

  it("tests matches locally", () => {
    renderWithIntl(<RegexTesterWorkspace />);

    fireEvent.change(screen.getByLabelText("Pattern"), { target: { value: "\\d+" } });
    fireEvent.change(screen.getByLabelText("Flags"), { target: { value: "g" } });
    fireEvent.change(screen.getByLabelText("Sample text"), { target: { value: "abc 123 def 456" } });
    fireEvent.click(screen.getByRole("button", { name: "Test regex" }));

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
    expect(screen.getByText("2 matches")).toBeInTheDocument();
  });
});
