import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SqlFormatterWorkspace } from "./sql-formatter-workspace";

const sqlFormatterSourceFile = "src/app/[locale]/tools/sql-formatter/sql-formatter-workspace.tsx";

function scanSqlFormatterWorkspaceSource() {
  return scanSourceText(readFileSync(sqlFormatterSourceFile, "utf8"), sqlFormatterSourceFile);
}

describe("SqlFormatterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSqlFormatterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and formats SQL", () => {
    renderWithIntl(<SqlFormatterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "sql-formatter");
    expect(screen.getByRole("heading", { name: "SQL Formatter" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("SQL input"), { target: { value: "select id from users where active=true" } });
    fireEvent.click(screen.getByRole("button", { name: "Format SQL" }));

    expect(screen.getByText(/SELECT/)).toBeInTheDocument();
    expect(screen.getByText(/FROM users/)).toBeInTheDocument();
  });
});
