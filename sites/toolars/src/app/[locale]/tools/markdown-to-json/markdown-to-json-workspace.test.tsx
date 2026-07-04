import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { MarkdownToJsonWorkspace } from "./markdown-to-json-workspace";

describe("MarkdownToJsonWorkspace", () => {
  it("renders the native Toolars Markdown to JSON workspace controls", () => {
    renderWithIntl(<MarkdownToJsonWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "markdown-to-json");
    expect(screen.getByRole("heading", { name: "Markdown to JSON Converter" })).toBeInTheDocument();
    expect(screen.getByText("Content parser workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("Markdown input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Convert Markdown" })).toBeDisabled();
  });

  it("converts markdown into structured JSON locally", () => {
    renderWithIntl(<MarkdownToJsonWorkspace />);

    fireEvent.change(screen.getByLabelText("Markdown input"), {
      target: { value: "# Release\n\nIntro paragraph.\n\n- One\n- Two" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert Markdown" }));

    expect(screen.getByLabelText("Markdown JSON output")).toHaveTextContent("\"title\": \"Release\"");
    expect(screen.getByText("Parsed 3 Markdown blocks into JSON.")).toBeInTheDocument();
  });
});
