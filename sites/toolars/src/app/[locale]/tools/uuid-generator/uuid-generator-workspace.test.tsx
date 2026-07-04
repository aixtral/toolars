import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { UUIDGeneratorWorkspace } from "./uuid-generator-workspace";

const uuidGeneratorSourceFile = "src/app/[locale]/tools/uuid-generator/uuid-generator-workspace.tsx";

function scanUuidGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(uuidGeneratorSourceFile, "utf8"), uuidGeneratorSourceFile);
}

describe("UUIDGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanUuidGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars native UUID generator workspace sections", () => {
    renderWithIntl(<UUIDGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "uuid-generator");
    expect(screen.getByRole("heading", { name: "UUID Generator" })).toBeInTheDocument();
    expect(screen.getByText("Identifier generation")).toBeInTheDocument();
    expect(screen.getByText("UUID options")).toBeInTheDocument();
    expect(screen.getByText("Generated UUIDs")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toHaveValue(5);
    expect(screen.getByRole("button", { name: "Generate UUIDs" })).toBeEnabled();
  });

  it("generates a local batch and renders copy-ready UUIDs", () => {
    renderWithIntl(<UUIDGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "3" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate UUIDs" }));

    expect(screen.getByText("3 UUIDs generated.")).toBeInTheDocument();
    expect(screen.getAllByText("UUID v4").length).toBeGreaterThan(0);
    expect(screen.getByText("Local UUID generation only; identifiers stay in the browser.")).toBeInTheDocument();
    expect(screen.getAllByText(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i)).toHaveLength(3);
  });
});
