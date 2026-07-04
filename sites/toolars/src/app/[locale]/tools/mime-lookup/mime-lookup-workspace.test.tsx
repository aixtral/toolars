import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { MimeLookupWorkspace } from "./mime-lookup-workspace";

const mimeLookupSourceFile = "src/app/[locale]/tools/mime-lookup/mime-lookup-workspace.tsx";

function scanMimeLookupWorkspaceSource() {
  return scanSourceText(readFileSync(mimeLookupSourceFile, "utf8"), mimeLookupSourceFile);
}

describe("MimeLookupWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanMimeLookupWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and finds MIME types", () => {
    renderWithIntl(<MimeLookupWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "mime-lookup");
    expect(screen.getByRole("heading", { name: "MIME Type Lookup" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("MIME search"), { target: { value: ".json" } });
    fireEvent.click(screen.getByRole("button", { name: "Search MIME" }));

    expect(screen.getByText(/application\/json/)).toBeInTheDocument();
  });
});
