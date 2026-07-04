import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { TextDiffWorkspace } from "./text-diff-workspace";

describe("TextDiffWorkspace", () => {
  it("renders the native Toolars Text Diff workspace controls", () => {
    renderWithIntl(<TextDiffWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "text-diff");
    expect(screen.getByRole("heading", { name: "Text Diff" })).toBeInTheDocument();
    expect(screen.getByText("Option-aware diff workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("Original text")).toBeInTheDocument();
    expect(screen.getByLabelText("Modified text")).toBeInTheDocument();
    expect(screen.getByLabelText("Ignore case")).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Compare text" })).toBeDisabled();
  });

  it("compares text with normalization options locally", () => {
    renderWithIntl(<TextDiffWorkspace />);

    fireEvent.click(screen.getByLabelText("Ignore case"));
    fireEvent.click(screen.getByLabelText("Trim lines"));
    fireEvent.change(screen.getByLabelText("Original text"), {
      target: { value: "  Hello  " }
    });
    fireEvent.change(screen.getByLabelText("Modified text"), {
      target: { value: "hello" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Compare text" }));

    expect(screen.getByLabelText("Option-aware diff output").textContent).toContain("  Hello  ");
    expect(screen.getByText("0 line changes found.")).toBeInTheDocument();
  });
});
