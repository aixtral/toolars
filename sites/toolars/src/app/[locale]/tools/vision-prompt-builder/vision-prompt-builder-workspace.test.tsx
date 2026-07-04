import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { VisionPromptBuilderWorkspace } from "./vision-prompt-builder-workspace";

const visionPromptBuilderSourceFile =
  "src/app/[locale]/tools/vision-prompt-builder/vision-prompt-builder-workspace.tsx";

function scanVisionPromptBuilderWorkspaceSource() {
  return scanSourceText(readFileSync(visionPromptBuilderSourceFile, "utf8"), visionPromptBuilderSourceFile);
}

describe("VisionPromptBuilderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanVisionPromptBuilderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and builds a multimodal prompt", () => {
    renderWithIntl(<VisionPromptBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "vision-prompt-builder");
    expect(screen.getByRole("heading", { name: "Vision Prompt Builder" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Visual checks"), {
      target: { value: "barcode legibility\nrecipient address visibility" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build vision prompt" }));

    expect(screen.getAllByText(/barcode legibility/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vision prompt ready/).length).toBeGreaterThan(0);
  });
});
