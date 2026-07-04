import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { JwtDecoderWorkspace } from "./jwt-decoder-workspace";

const jwtDecoderSourceFile = "src/app/[locale]/tools/jwt-decoder/jwt-decoder-workspace.tsx";

function scanJwtDecoderWorkspaceSource() {
  return scanSourceText(readFileSync(jwtDecoderSourceFile, "utf8"), jwtDecoderSourceFile);
}

function base64UrlJson(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

describe("JwtDecoderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanJwtDecoderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native JWT Decoder controls", () => {
    renderWithIntl(<JwtDecoderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "jwt-decoder");
    expect(screen.getByRole("heading", { name: "JWT Decoder" })).toBeInTheDocument();
    expect(screen.getByLabelText("JWT input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decode JWT" })).toBeDisabled();
  });

  it("decodes token claims locally", () => {
    const token = `${base64UrlJson({ alg: "HS256", typ: "JWT" })}.${base64UrlJson({ sub: "user-123", name: "Ada" })}.sig`;
    renderWithIntl(<JwtDecoderWorkspace />);

    fireEvent.change(screen.getByLabelText("JWT input"), { target: { value: token } });
    fireEvent.click(screen.getByRole("button", { name: "Decode JWT" }));

    expect(screen.getByText("HS256")).toBeInTheDocument();
    expect(screen.getByText(/\"name\": \"Ada\"/)).toBeInTheDocument();
    expect(screen.getAllByText("Decode only").length).toBeGreaterThan(0);
  });
});
