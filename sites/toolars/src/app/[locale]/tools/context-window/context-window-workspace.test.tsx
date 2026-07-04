import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ContextWindowWorkspace } from "./context-window-workspace";

describe("ContextWindowWorkspace", () => {
  it("renders the Toolars context window workspace", () => {
    renderWithIntl(<ContextWindowWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "context-window");
    expect(screen.getByRole("heading", { name: "Context Window Visualizer" })).toBeInTheDocument();
    expect(screen.getByText("Context allocation")).toBeInTheDocument();
    expect(screen.getByLabelText("Context window size")).toHaveDisplayValue("16000");
    expect(screen.getByLabelText("Segment tokens")).toBeInTheDocument();
  });

  it("visualizes remaining tokens and utilization", () => {
    renderWithIntl(<ContextWindowWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Visualize context" }));

    expect(screen.getByText("Remaining tokens")).toBeInTheDocument();
    expect(screen.getByText("Utilization")).toBeInTheDocument();
    expect(screen.getByText(/Context is tight/)).toBeInTheDocument();
  });
});
