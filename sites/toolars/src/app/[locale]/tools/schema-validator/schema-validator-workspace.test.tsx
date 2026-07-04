import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SchemaValidatorWorkspace } from "./schema-validator-workspace";

const schemaValidatorSourceFile = "src/app/[locale]/tools/schema-validator/schema-validator-workspace.tsx";

function scanSchemaValidatorWorkspaceSource() {
  return scanSourceText(readFileSync(schemaValidatorSourceFile, "utf8"), schemaValidatorSourceFile);
}

describe("SchemaValidatorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSchemaValidatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and validates JSON data against schema", () => {
    renderWithIntl(<SchemaValidatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "schema-validator");
    expect(screen.getByRole("heading", { name: "Schema Validator" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Schema JSON"), {
      target: { value: '{"type":"object","required":["email"],"properties":{"email":{"type":"string"}}}' }
    });
    fireEvent.change(screen.getByLabelText("Data JSON"), { target: { value: '{"name":"Ada"}' } });
    fireEvent.click(screen.getByRole("button", { name: "Validate data" }));

    expect(screen.getByText("$.email")).toBeInTheDocument();
  });
});
