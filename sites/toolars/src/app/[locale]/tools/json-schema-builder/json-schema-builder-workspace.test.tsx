import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { JsonSchemaBuilderWorkspace } from "./json-schema-builder-workspace";

const jsonSchemaBuilderSourceFile =
  "src/app/[locale]/tools/json-schema-builder/json-schema-builder-workspace.tsx";

function scanJsonSchemaBuilderWorkspaceSource() {
  return scanSourceText(readFileSync(jsonSchemaBuilderSourceFile, "utf8"), jsonSchemaBuilderSourceFile);
}

describe("JsonSchemaBuilderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanJsonSchemaBuilderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and builds schema JSON", () => {
    renderWithIntl(<JsonSchemaBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-schema-builder");
    expect(screen.getByRole("heading", { name: "JSON Schema Builder" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Field rows"), { target: { value: "email:string:required:email" } });
    fireEvent.click(screen.getByRole("button", { name: "Build schema" }));

    expect(screen.getByText(/"email"/)).toBeInTheDocument();
    expect(screen.getByText(/"format": "email"/)).toBeInTheDocument();
  });
});
