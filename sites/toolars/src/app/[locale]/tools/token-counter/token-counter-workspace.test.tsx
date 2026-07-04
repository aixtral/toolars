import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { TokenCounterWorkspace } from "./token-counter-workspace";

const tokenCounterSourceFile = "src/app/[locale]/tools/token-counter/token-counter-workspace.tsx";

function scanTokenCounterWorkspaceSource() {
  return scanSourceText(readFileSync(tokenCounterSourceFile, "utf8"), tokenCounterSourceFile);
}

describe("TokenCounterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanTokenCounterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars token counting workspace sections", () => {
    renderWithIntl(<TokenCounterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "token-counter");
    expect(screen.getByRole("heading", { name: "Token Counter" })).toBeInTheDocument();
    expect(screen.getByText("Prompt sizing")).toBeInTheDocument();
    expect(screen.getByText("Estimate results")).toBeInTheDocument();
    expect(screen.getByText("Model comparison")).toBeInTheDocument();
    expect(screen.getByLabelText("Prompt text")).toBeInTheDocument();
    expect(screen.getByLabelText("Model")).toHaveDisplayValue("GPT-4o");
    expect(screen.getByRole("button", { name: "Count tokens" })).toBeDisabled();
  });

  it("estimates token counts and model cost locally", () => {
    renderWithIntl(<TokenCounterWorkspace />);

    fireEvent.change(screen.getByLabelText("Prompt text"), {
      target: { value: "a".repeat(400) }
    });
    fireEvent.click(screen.getByRole("button", { name: "Count tokens" }));

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getAllByText("$0.000500").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("400 characters")).toBeInTheDocument();
    expect(screen.getByText("Local estimate only; no prompt text leaves the browser.")).toBeInTheDocument();
  });

  it("updates cost when the selected model changes", () => {
    renderWithIntl(<TokenCounterWorkspace />);

    fireEvent.change(screen.getByLabelText("Model"), {
      target: { value: "gpt-4o-mini" }
    });
    fireEvent.change(screen.getByLabelText("Prompt text"), {
      target: { value: "a".repeat(400) }
    });
    fireEvent.click(screen.getByRole("button", { name: "Count tokens" }));

    expect(screen.getAllByText("$0.000015").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("GPT-4o mini").length).toBeGreaterThanOrEqual(1);
  });
});
