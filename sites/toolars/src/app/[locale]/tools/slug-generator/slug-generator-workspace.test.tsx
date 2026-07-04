import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SlugGeneratorWorkspace } from "./slug-generator-workspace";

const slugGeneratorSourceFile = "src/app/[locale]/tools/slug-generator/slug-generator-workspace.tsx";

function scanSlugGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(slugGeneratorSourceFile, "utf8"), slugGeneratorSourceFile);
}

describe("SlugGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSlugGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars native slug generator workspace sections", () => {
    renderWithIntl(<SlugGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "slug-generator");
    expect(screen.getByRole("heading", { name: "Slug Generator" })).toBeInTheDocument();
    expect(screen.getByText("URL slug workbench")).toBeInTheDocument();
    expect(screen.getByText("Slug options")).toBeInTheDocument();
    expect(screen.getByText("Generated slugs")).toBeInTheDocument();
    expect(screen.getByLabelText("Source titles")).toBeInTheDocument();
    expect(screen.getByLabelText("Separator")).toHaveDisplayValue("Hyphen (-)");
    expect(screen.getByRole("button", { name: "Generate slugs" })).toBeDisabled();
  });

  it("generates deduplicated slugs and records unique history entries", () => {
    renderWithIntl(<SlugGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Source titles"), {
      target: { value: "Café World\nCafe World" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate slugs" }));

    expect(screen.getAllByText("cafe-world-2")).toHaveLength(2);
    expect(screen.getByText("2 slugs generated; 1 duplicate resolved.")).toBeInTheDocument();
    expect(screen.getByText("Recent slugs")).toBeInTheDocument();
    expect(screen.getAllByText("cafe-world")).toHaveLength(2);
  });

  it("clears the workspace without clearing history", () => {
    renderWithIntl(<SlugGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Source titles"), {
      target: { value: "Hello World" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate slugs" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear workspace" }));

    expect(screen.getByLabelText("Source titles")).toHaveValue("");
    expect(screen.getAllByText("Add titles to generate copy-ready URL slugs.").length).toBeGreaterThan(0);
    expect(screen.getByText("hello-world")).toBeInTheDocument();
  });
});
