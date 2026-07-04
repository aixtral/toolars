import { fireEvent, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { MockDataGeneratorWorkspace } from "./mock-data-generator-workspace";

const mockDataGeneratorSourceFile = "src/app/[locale]/tools/mock-data-generator/mock-data-generator-workspace.tsx";

function scanMockDataGeneratorSource() {
  return scanSourceText(readFileSync(mockDataGeneratorSourceFile, "utf8"), mockDataGeneratorSourceFile);
}

describe("MockDataGeneratorWorkspace", () => {
  it("keeps workspace source free of hardcoded UI scanner candidates", () => {
    const sourceScan = scanMockDataGeneratorSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and generates deterministic mock data", () => {
    renderWithIntl(<MockDataGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "mock-data-generator");
    expect(screen.getByRole("heading", { name: "Mock Data Generator" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Field schema"), {
      target: { value: "email:email\nstatus:enum(active|paused)" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate mock data" }));

    expect(screen.getByText(/user1@example.com/)).toBeInTheDocument();
    expect(screen.getAllByText(/2 rows/).length).toBeGreaterThan(0);
  });
});
