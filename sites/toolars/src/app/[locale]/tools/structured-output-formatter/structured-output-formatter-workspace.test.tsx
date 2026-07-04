import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { StructuredOutputFormatterWorkspace } from "./structured-output-formatter-workspace";

const structuredOutputFormatterSourceFile = "src/app/[locale]/tools/structured-output-formatter/structured-output-formatter-workspace.tsx";

function scanStructuredOutputFormatterSource() {
  return scanSourceText(readFileSync(structuredOutputFormatterSourceFile, "utf8"), structuredOutputFormatterSourceFile);
}

describe("StructuredOutputFormatterWorkspace", () => {
  it("keeps workspace source free of hardcoded UI scanner candidates", () => {
    const sourceScan = scanStructuredOutputFormatterSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and formats local structured output", () => {
    renderWithIntl(<StructuredOutputFormatterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "structured-output-formatter");
    expect(screen.getByRole("heading", { name: "Structured Output Formatter" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Model output"), {
      target: { value: "{\"title\":\"Roadmap\",\"score\":0.82}" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Format output" }));

    expect(screen.getByText(/"score": 0.82/)).toBeInTheDocument();
    expect(screen.getAllByText(/Missing fields/).length).toBeGreaterThan(0);
  });
});
