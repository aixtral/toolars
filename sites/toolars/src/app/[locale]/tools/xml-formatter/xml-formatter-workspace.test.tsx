import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { XmlFormatterWorkspace } from "./xml-formatter-workspace";

const xmlFormatterSourceFile = "src/app/[locale]/tools/xml-formatter/xml-formatter-workspace.tsx";

function scanXmlFormatterWorkspaceSource() {
  return scanSourceText(readFileSync(xmlFormatterSourceFile, "utf8"), xmlFormatterSourceFile);
}

describe("XmlFormatterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanXmlFormatterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the native Toolars XML formatter workspace controls", () => {
    renderWithIntl(<XmlFormatterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "xml-formatter");
    expect(screen.getByRole("heading", { name: "XML Formatter" })).toBeInTheDocument();
    expect(screen.getByText("Markup formatter workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("XML input")).toBeInTheDocument();
    expect(screen.getByLabelText("Mode")).toHaveDisplayValue("Format");
    expect(screen.getByRole("button", { name: "Format XML" })).toBeDisabled();
  });

  it("formats XML locally and shows indented output", () => {
    renderWithIntl(<XmlFormatterWorkspace />);

    fireEvent.change(screen.getByLabelText("XML input"), {
      target: { value: "<root><child>hello</child></root>" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Format XML" }));

    expect(screen.getByLabelText("Formatted XML output")).toHaveTextContent("<child>hello</child>");
    expect(screen.getByText("Formatted XML into 3 lines.")).toBeInTheDocument();
  });
});
