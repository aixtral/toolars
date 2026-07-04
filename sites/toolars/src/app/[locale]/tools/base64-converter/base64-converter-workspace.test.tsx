import { execFileSync } from "node:child_process";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { Base64ConverterWorkspace } from "./base64-converter-workspace";

function scanBase64ConverterWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/base64-converter/base64-converter-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("Base64ConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBase64ConverterWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the native Toolars Base64 workspace controls", () => {
    renderWithIntl(<Base64ConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "base64-converter");
    expect(screen.getByRole("heading", { name: "Base64 Converter" })).toBeInTheDocument();
    expect(screen.getByLabelText("Input text")).toBeInTheDocument();
    expect(screen.getByLabelText("Mode")).toHaveDisplayValue("Encode");
    expect(screen.getByLabelText("Alphabet")).toHaveDisplayValue("Standard Base64");
    expect(screen.getByRole("button", { name: "Convert Base64" })).toBeDisabled();
  });

  it("decodes URL-safe Base64 and reports normalization warnings", () => {
    renderWithIntl(<Base64ConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Mode"), {
      target: { value: "decode" }
    });
    fireEvent.change(screen.getByLabelText("Alphabet"), {
      target: { value: "url-safe" }
    });
    fireEvent.change(screen.getByLabelText("Input text"), {
      target: { value: "eyJyb2xlIjoiYWRtaW4ifQ" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert Base64" }));

    expect(screen.getByText('{"role":"admin"}')).toBeInTheDocument();
    expect(screen.getByText("Added missing Base64 padding before decoding.")).toBeInTheDocument();
    expect(screen.getByText("Conversion ready")).toBeInTheDocument();
  });
});
