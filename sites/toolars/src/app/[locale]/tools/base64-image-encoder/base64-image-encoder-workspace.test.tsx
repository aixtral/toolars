import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { Base64ImageEncoderWorkspace } from "./base64-image-encoder-workspace";

const base64ImageEncoderSourceFile =
  "src/app/[locale]/tools/base64-image-encoder/base64-image-encoder-workspace.tsx";

function scanBase64ImageEncoderWorkspaceSource() {
  return scanSourceText(readFileSync(base64ImageEncoderSourceFile, "utf8"), base64ImageEncoderSourceFile);
}

describe("Base64ImageEncoderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanBase64ImageEncoderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native Base64 image controls and data URL output", () => {
    renderWithIntl(<Base64ImageEncoderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "base64-image-encoder");
    fireEvent.change(screen.getByLabelText("Image Base64 or data URL"), { target: { value: "aGVsbG8=" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect image" }));

    expect(screen.getByLabelText("Image data URL output")).toHaveTextContent("data:image/png;base64,aGVsbG8=");
  });
});
