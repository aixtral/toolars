import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CronExplainerWorkspace } from "./cron-explainer-workspace";

const cronExplainerSourceFile = "src/app/[locale]/tools/cron-explainer/cron-explainer-workspace.tsx";

function scanCronExplainerWorkspaceSource() {
  return scanSourceText(readFileSync(cronExplainerSourceFile, "utf8"), cronExplainerSourceFile);
}

describe("CronExplainerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCronExplainerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and explains cron syntax", () => {
    renderWithIntl(<CronExplainerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "cron-explainer");
    expect(screen.getByRole("heading", { name: "Cron Explainer" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Cron expression"), { target: { value: "*/15 9-17 * * 1-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Explain cron" }));

    expect(screen.getByText(/Every 15 minutes/)).toBeInTheDocument();
  });
});
