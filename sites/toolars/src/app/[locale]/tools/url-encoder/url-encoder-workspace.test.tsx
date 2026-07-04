import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { UrlEncoderWorkspace } from "./url-encoder-workspace";

const urlEncoderSourceFile = "src/app/[locale]/tools/url-encoder/url-encoder-workspace.tsx";

function scanUrlEncoderWorkspaceSource() {
  return scanSourceText(readFileSync(urlEncoderSourceFile, "utf8"), urlEncoderSourceFile);
}

describe("UrlEncoderWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanUrlEncoderWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the native Toolars URL encoder workspace controls", () => {
    renderWithIntl(<UrlEncoderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "url-encoder");
    expect(screen.getByRole("heading", { name: "URL Encoder" })).toBeInTheDocument();
    expect(screen.getByText("URL component workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("URL text")).toBeInTheDocument();
    expect(screen.getByLabelText("Mode")).toHaveDisplayValue("Encode");
    expect(screen.getByRole("button", { name: "Convert URL" })).toBeDisabled();
  });

  it("encodes URL component input locally", () => {
    renderWithIntl(<UrlEncoderWorkspace />);

    fireEvent.change(screen.getByLabelText("URL text"), {
      target: { value: "hello world & a=1" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert URL" }));

    expect(screen.getByLabelText("Converted URL output")).toHaveTextContent("hello%20world%20%26%20a%3D1");
    expect(screen.getByText("Conversion ready")).toBeInTheDocument();
  });

  it("surfaces invalid percent encoding before output reuse", () => {
    renderWithIntl(<UrlEncoderWorkspace />);

    fireEvent.change(screen.getByLabelText("Mode"), {
      target: { value: "decode" }
    });
    fireEvent.change(screen.getByLabelText("URL text"), {
      target: { value: "%E0%A4%A" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert URL" }));

    expect(screen.getByText("Invalid percent-encoded input.")).toBeInTheDocument();
    expect(screen.getByText("Review input")).toBeInTheDocument();
  });
});
