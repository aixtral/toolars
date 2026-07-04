import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { DiffCheckerWorkspace } from "./diff-checker-workspace";

describe("DiffCheckerWorkspace", () => {
  it("renders the native Toolars Diff Checker workspace controls", () => {
    renderWithIntl(<DiffCheckerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "diff-checker");
    expect(screen.getByRole("heading", { name: "Diff Checker" })).toBeInTheDocument();
    expect(screen.getByText("Line diff workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("Original text")).toBeInTheDocument();
    expect(screen.getByLabelText("Revised text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compare text" })).toBeDisabled();
  });

  it("compares text versions locally and shows line changes", () => {
    renderWithIntl(<DiffCheckerWorkspace />);

    fireEvent.change(screen.getByLabelText("Original text"), {
      target: { value: "alpha\nbeta" }
    });
    fireEvent.change(screen.getByLabelText("Revised text"), {
      target: { value: "alpha\ngamma\nbeta" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Compare text" }));

    expect(screen.getByLabelText("Text diff output")).toHaveTextContent("+ gamma");
    expect(screen.getByText("1 line change found.")).toBeInTheDocument();
  });
});
