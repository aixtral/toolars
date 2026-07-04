import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { UnicodeSearchWorkspace } from "./unicode-search-workspace";

const unicodeSearchSourceFile =
  "src/app/[locale]/tools/unicode-search/unicode-search-workspace.tsx";

function scanUnicodeSearchWorkspaceSource() {
  return scanSourceText(readFileSync(unicodeSearchSourceFile, "utf8"), unicodeSearchSourceFile);
}

describe("UnicodeSearchWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanUnicodeSearchWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and finds Unicode characters", () => {
    renderWithIntl(<UnicodeSearchWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "unicode-search");
    expect(screen.getByRole("heading", { name: "Unicode Character Search" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Unicode search"), { target: { value: "copyright" } });
    fireEvent.click(screen.getByRole("button", { name: "Search Unicode" }));

    expect(screen.getByText("U+00A9")).toBeInTheDocument();
    expect(screen.getByText(/Copyright Sign/)).toBeInTheDocument();
  });
});
