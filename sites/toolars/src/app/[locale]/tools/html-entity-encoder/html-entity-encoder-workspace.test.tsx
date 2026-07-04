import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { HtmlEntityEncoderWorkspace } from "./html-entity-encoder-workspace";

const htmlEntityEncoderSourceFile =
  "src/app/[locale]/tools/html-entity-encoder/html-entity-encoder-workspace.tsx";

function scanHtmlEntityEncoderWorkspaceSource() {
  return scanSourceText(readFileSync(htmlEntityEncoderSourceFile, "utf8"), htmlEntityEncoderSourceFile);
}

describe("HtmlEntityEncoderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanHtmlEntityEncoderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the native Toolars HTML entity workspace controls", () => {
    renderWithIntl(<HtmlEntityEncoderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "html-entity-encoder");
    expect(screen.getByRole("heading", { name: "HTML Entity Encoder" })).toBeInTheDocument();
    expect(screen.getByText("Safe rendering workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML text")).toBeInTheDocument();
    expect(screen.getByLabelText("Mode")).toHaveDisplayValue("Encode");
    expect(screen.getByLabelText("Entity style")).toHaveDisplayValue("Named entities");
  });

  it("decodes mixed HTML entities and shows review guidance", () => {
    renderWithIntl(<HtmlEntityEncoderWorkspace />);

    fireEvent.change(screen.getByLabelText("Mode"), {
      target: { value: "decode" }
    });
    fireEvent.change(screen.getByLabelText("HTML text"), {
      target: { value: "&lt;strong&gt;Safe &amp; sound&lt;/strong&gt;" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert entities" }));

    expect(screen.getByLabelText("Converted entity output")).toHaveTextContent("<strong>Safe & sound</strong>");
    expect(screen.getByText("Review decoded text before rendering it as HTML.")).toBeInTheDocument();
    expect(screen.getByText("Conversion ready")).toBeInTheDocument();
  });
});
