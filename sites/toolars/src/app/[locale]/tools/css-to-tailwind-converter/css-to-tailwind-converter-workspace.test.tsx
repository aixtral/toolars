import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CssToTailwindConverterWorkspace } from "./css-to-tailwind-converter-workspace";

const cssToTailwindSourceFile = "src/app/[locale]/tools/css-to-tailwind-converter/css-to-tailwind-converter-workspace.tsx";

function scanCssToTailwindConverterWorkspaceSource() {
  return scanSourceText(readFileSync(cssToTailwindSourceFile, "utf8"), cssToTailwindSourceFile);
}

describe("CssToTailwindConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCssToTailwindConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native CSS input and Tailwind output", () => {
    renderWithIntl(<CssToTailwindConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-to-tailwind-converter");
    fireEvent.change(screen.getByLabelText("CSS declarations"), { target: { value: "display: flex; gap: 1rem;" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert CSS" }));

    expect(screen.getByLabelText("Tailwind class output")).toHaveTextContent("flex gap-4");
  });
});
