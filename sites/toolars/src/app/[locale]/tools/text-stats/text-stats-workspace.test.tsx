import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { TextStatsWorkspace } from "./text-stats-workspace";

describe("TextStatsWorkspace", () => {
  it("renders the Toolars native text statistics workspace sections", () => {
    renderWithIntl(<TextStatsWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "text-stats");
    expect(screen.getByRole("heading", { name: "Text Stats" })).toBeInTheDocument();
    expect(screen.getAllByText("Writing metrics").length).toBeGreaterThan(0);
    expect(screen.getByText("Text input")).toBeInTheDocument();
    expect(screen.getByText("Writing stats")).toBeInTheDocument();
    expect(screen.getByText("Top words")).toBeInTheDocument();
    expect(screen.getByLabelText("Source text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Analyze text" })).toBeDisabled();
  });

  it("analyzes text locally and shows structure, timing, and repeated words", () => {
    renderWithIntl(<TextStatsWorkspace />);

    fireEvent.change(screen.getByLabelText("Source text"), {
      target: { value: "Hello world! Hello Toolars.\n\nShip fast, review carefully." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze text" }));

    expect(screen.getByText("8 words analyzed across 2 paragraphs.")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    expect(screen.getByText("2 sec")).toBeInTheDocument();
    expect(screen.getByText("4 sec")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("2 uses")).toBeInTheDocument();
    expect(screen.getByText("Local analysis only; source text stays in the browser.")).toBeInTheDocument();
  });
});
